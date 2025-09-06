import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "@src/app/module/auth/service";
import { CacheService } from "./service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AccountCacheService {

    private readonly currentAccountId = signal<string | null>(null);

    private readonly authService = inject(AuthService);
    private readonly cacheService = inject(CacheService);

    constructor() {
        this.authService.authIdentity$.subscribe(value => {
            this.currentAccountId.set(value !== null ? value.publicId : null);
        });
    }

    set<T>(key: string, item: T): Observable<void> {
        return this.cacheService.set$(this.getPrefix(), key, item);
    }

    get<T>(key: string): Observable<T | undefined> {
        return this.cacheService.get$(this.getPrefix(), key);
    }

    remove(key: string): Observable<void> {
        return this.cacheService.remove$(this.getPrefix(), key);
    }

    private getPrefix() {
        const accountId = this.currentAccountId();
        if (accountId === null) {
            throw new Error(`AccountCacheService does not have a current account ID`);
        }
        return accountId;
    }

}