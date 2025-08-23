export interface StorageProvider {
    set<T>(key: string, value: T): void;
    get<T>(key: string): T | undefined;
    remove(key: string): void;
}

export interface AsyncStorageProvider {
    set<T>(key: string, value: T): Promise<void>;
    get<T>(key: string): Promise<T | undefined>;
    remove(key: string): Promise<void>;
}