export interface AsyncStorageProvider {
    set<T>(key: string, value: T): Promise<void>;
    get<T>(key: string): Promise<T | undefined>;
    remove(key: string): Promise<void>;
}