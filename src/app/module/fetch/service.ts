import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '@src/environments/environment';
import { CacheableResponse } from "@src/app/model/cacheable-response";
import { CacheService } from "@src/app/module/cache/service";
import { getCurrentUnix } from "@src/app/util/date";
import { take } from "rxjs";

export enum FetchStrategy {
    CacheAndNetwork = "cacheAndNetwork",
    Network = "network",
}

type ResponseCacheEntry<T> = {
    name: string;
    retrievedAt: number;
    content: T;
    hash: string;
}

export type HttpRequest = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}

export type FetchSubscription<T> = {
    name: string;
    request: HttpRequest,
    // amount of seconds while the same response will be returned without going to network
    // if no network is available the stale data will still be returned
    bestBeforeSeconds: number;
    strategy: FetchStrategy;
    onUpdate?: (update: T) => void;
}

export type FetchHandle = {
    fetch: () => void;
    unsubscribe: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class FetchService {

    private static CACHE_KEY_REQUESTS = "requests";

    private subscriptions: Map<Symbol, FetchSubscription<any>> = new Map();

    constructor(private readonly cacheService: CacheService, private readonly http: HttpClient) {}

    subscribe<T>(subscription: FetchSubscription<T>): FetchHandle {
        const subscriptionSymbol = Symbol();
        this.subscriptions.set(subscriptionSymbol, subscription);
        console.log(`registered fetch subscription ${subscription.name}`);
        return this.createFetchHandle(subscriptionSymbol);
    }

    private getSubscriptionOrThrow(subscriptionSymbol: Symbol): FetchSubscription<unknown> {
        const subscription = this.subscriptions.get(subscriptionSymbol);
        if (subscription === undefined) {
            throw new Error(`No subscription registered for this handle`);
        }
        return subscription;
    }

    private createFetchHandle(subscriptionSymbol: Symbol): FetchHandle {
        return {
            fetch: () => {
                const subscription = this.getSubscriptionOrThrow(subscriptionSymbol);
                this.processSubscription(subscription);
            },
            unsubscribe: () => {
                this.subscriptions.delete(subscriptionSymbol);
            }
        };
    }

    private async processSubscription(subscription: FetchSubscription<unknown>): Promise<void> {
        console.log(`starting processing subscription ${subscription.name}`);

        const currentUnix = getCurrentUnix();

        // for cacheAndNetwork, check if subscription has a cache entry
        let currentContentHash: string | undefined = undefined;
        let currentContent: unknown | undefined = undefined;
        if (subscription.strategy === FetchStrategy.CacheAndNetwork) {
            const cacheEntry = await this.cacheService.get<ResponseCacheEntry<unknown>>(FetchService.CACHE_KEY_REQUESTS, subscription.name);
            if (cacheEntry !== undefined) {
                // cache entry exists, return the stored data immediately and only update it if newer data is available
                if (subscription.onUpdate !== undefined) {
                    subscription.onUpdate(cacheEntry.content);
                }

                currentContentHash = cacheEntry.hash;
                currentContent = cacheEntry.content;

                const cacheFreshnessExpiration = cacheEntry.retrievedAt + subscription.bestBeforeSeconds;
                if (currentUnix <= cacheFreshnessExpiration) {
                    console.info(`cache entry is still fresh, not going to network (current: ${currentUnix}, expiration: ${cacheFreshnessExpiration})`);
                    return;
                }
            }
        }

        // request data
        try {
            const response = await this.httpRequest<CacheableResponse<unknown>>(subscription.request, currentContentHash);
            console.log(`received HTTP response`, response);

            const responseStatus = response.status;

            if (responseStatus === 204 && currentContent !== undefined && currentContentHash !== undefined) {
                console.log(`received 204, only updating the cache entry freshness`);
                // nothing has changed, we only have to update the freshness mark of the old entry
                const updateEntry: ResponseCacheEntry<unknown> = {
                    name: subscription.name,
                    content: currentContent,
                    hash: currentContentHash,
                    retrievedAt: currentUnix,
                }
                await this.cacheService.set(FetchService.CACHE_KEY_REQUESTS, subscription.name, updateEntry);
                return;
            }

            const responseBody = response.body;
            if (responseBody === undefined || responseBody === null) {
                throw new Error(`Response has no body`);
            }

            const { contentHash, ...rest } = responseBody;

            // if it was a paginated response, get the items directly
            let cacheableResponse: any = rest;
            if ('items' in rest) {
                cacheableResponse = rest.items;
            }
    
            // call on update with new data
            if (subscription.onUpdate !== undefined) {
                subscription.onUpdate(cacheableResponse);
            }

            // update cache entry
            const cacheEntry: ResponseCacheEntry<unknown> = {
                name: subscription.name,
                content: cacheableResponse,
                hash: contentHash,
                retrievedAt: currentUnix,
            }
            await this.cacheService.set(FetchService.CACHE_KEY_REQUESTS, subscription.name, cacheEntry);
        } catch (err) {
            console.error(err);
        }
        console.log(`finished processing subscription ${subscription.name}`);
    }

    private getFullRequestUrl(path: string): string {
        return `${environment.apiBaseUrl}${path}`;
    }

    private async httpRequest<T>(request: HttpRequest, contentHash?: string): Promise<HttpResponse<T>> {
        switch (request.method) {
            case 'GET':
                return await this.getRequest(request, contentHash);
            default:
                throw new Error(`Not all methods implemented`);
        }
    }

    private async getRequest<T>(request: HttpRequest, contentHash?: string): Promise<HttpResponse<T>> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders();
            if (contentHash !== undefined) {
                headers.set('x-content-hash', contentHash);
            }

            this.http.get<T>(this.getFullRequestUrl(request.url), { headers,  observe: 'response' }).pipe(take(1)).subscribe({
                next: response => resolve(response),
                error: error => reject(error),
            });
        })
    }

}