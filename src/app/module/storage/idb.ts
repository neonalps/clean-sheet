import { Injectable } from "@angular/core";
import { AsyncStorageProvider } from "./provider";
import { del, get, set } from 'idb-keyval';

@Injectable({
    providedIn: 'root'
})
export class IndexedDbStorageProvider implements AsyncStorageProvider {

    async set<T>(key: string, value: T): Promise<void> {
        await set(key, value);
    }

    async get<T>(key: string): Promise<T | undefined> {
        return await get(key);
    }

    async remove(key: string): Promise<void> {
        await del(key);
    }
    
}