import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from '@src/environments/environment';
import { CacheableResponse } from "@src/app/model/cacheable-response";
import { CacheService } from "@src/app/module/cache/service";
import { getCurrentUnix, getDateFromUnixTimestamp } from "@src/app/util/date";
import { take } from "rxjs";
import { AccountCacheService } from "@src/app/module/cache/account";

export enum FetchStrategy {
    CacheAndNetwork = "cacheAndNetwork",
    Network = "network",
}

export enum FetchScope {
    Account = "account",
    Global = "global",
}

export type FetchOpts = {
    force?: boolean;
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
    // indicates whether the received response is valid globally or per account
    scope: FetchScope;
    onUpdate?: (update: T) => void;
}

export type FetchHandle = {
    fetch: (force?: boolean) => void;
    unsubscribe: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class FetchService {

    private static CACHE_KEY_REQUESTS = "requests";

    private subscriptions: Map<Symbol, FetchSubscription<any>> = new Map();

    private readonly accountCacheService = inject(AccountCacheService);
    private readonly cacheService = inject(CacheService);
    private readonly http = inject(HttpClient);

    subscribe<T>(subscription: FetchSubscription<T>): FetchHandle {
        const subscriptionSymbol = Symbol();
        this.subscriptions.set(subscriptionSymbol, subscription);
        console.log(`registered fetch subscription ${subscription.name}`);
        return this.createFetchHandle(subscriptionSymbol);
    }

    async getFromCache<T>(requestName: string): Promise<T | undefined> {
        const cacheEntry = await this.cacheService.get<ResponseCacheEntry<T>>(FetchService.CACHE_KEY_REQUESTS, requestName);
        return cacheEntry?.content;
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
            fetch: (force?: boolean) => {
                const subscription = this.getSubscriptionOrThrow(subscriptionSymbol);
                this.processSubscription(subscription, { force });
            },
            unsubscribe: () => {
                this.subscriptions.delete(subscriptionSymbol);
            }
        };
    }

    private async processSubscription(subscription: FetchSubscription<unknown>, opts: FetchOpts = {}): Promise<void> {
        console.log(`[${subscription.name}] starting processing subscription`);

        const forceFetch = opts.force === true;
        if (forceFetch) {
            console.log('force fetch mode set');
        }

        const currentUnix = getCurrentUnix();

        // for cacheAndNetwork, check if subscription has a cache entry
        let currentContentHash: string | undefined = undefined;
        let currentContent: unknown | undefined = undefined;
        if (subscription.strategy === FetchStrategy.CacheAndNetwork && !forceFetch) {
            const cacheEntry = await this.cacheService.get<ResponseCacheEntry<unknown>>(FetchService.CACHE_KEY_REQUESTS, subscription.name);
            if (cacheEntry !== undefined) {
                // cache entry exists, return the stored data immediately and only update it if newer data is available
                subscription.onUpdate?.(cacheEntry.content);

                currentContentHash = cacheEntry.hash;
                currentContent = cacheEntry.content;

                const cacheFreshnessExpiration = cacheEntry.retrievedAt + subscription.bestBeforeSeconds;
                if (currentUnix <= cacheFreshnessExpiration) {
                    console.info(`[${subscription.name}] cache entry is still fresh, not going to network (current: ${getDateFromUnixTimestamp(currentUnix).toISOString()}, expiration: ${getDateFromUnixTimestamp(cacheFreshnessExpiration).toISOString()})`);
                    return;
                }
            }
        }

        // request data
        try {
            const response = await this.httpRequest<CacheableResponse<unknown>>(subscription.request, currentContentHash);
            const responseStatus = response.status;

            if (responseStatus === 204 && currentContent !== undefined && currentContentHash !== undefined) {
                console.log(`[${subscription.name}] received 204, only updating the cache entry freshness`);
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

            if (subscription.strategy === FetchStrategy.Network) {
                // call on update with new data and return
                if (subscription.onUpdate !== undefined) {
                    subscription.onUpdate(responseBody);
                }
            } else {
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
            }
        } catch (err) {
            console.error(err);
        }
        console.log(`[${subscription.name}] finished processing subscription`);
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
            const headers = contentHash !== undefined ? new HttpHeaders({ 'x-content-hash': contentHash }) : new HttpHeaders();

            this.http.get<T>(this.getFullRequestUrl(request.url), { headers,  observe: 'response' }).pipe(take(1)).subscribe({
                next: response => resolve(response),
                error: error => reject(error),
            });
        })
    }

}