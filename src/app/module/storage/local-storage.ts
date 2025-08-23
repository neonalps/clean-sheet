import { Injectable } from "@angular/core";
import { StorageProvider } from "./provider";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageStorageProvider implements StorageProvider {

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get<T>(key: string): T | undefined {
        const value = localStorage.getItem(key);
        if (value === null) {
            return;
        }

        return JSON.parse(value) as T;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }
    
}