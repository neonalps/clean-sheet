import { Injectable } from "@angular/core";
import { IndexedDbStorageProvider } from "@src/app/module/storage/idb";
import { AsyncStorageProvider } from "@src/app/module/storage/provider";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private readonly asyncStorage: AsyncStorageProvider;

    constructor(storageProvider: IndexedDbStorageProvider) {
        this.asyncStorage = storageProvider;
    }

    async set<T>(prefix: string, key: string, item: T): Promise<void> {
        await this.asyncStorage.set(this.getPrefixedKey(prefix, key), item);
    }

    async get<T>(prefix: string, key: string): Promise<T | undefined> {
        return await this.asyncStorage.get(this.getPrefixedKey(prefix, key));
    }

    async remove(prefix: string, key: string): Promise<void> {
        await this.asyncStorage.remove(this.getPrefixedKey(prefix, key));
    }

    private getPrefixedKey(prefix: string, key: string): string {
        return [prefix, key].join(':');
    }

}