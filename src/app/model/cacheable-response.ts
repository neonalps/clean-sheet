type ContentHash = {
    contentHash: string;
}

export type CacheableResponse<T> = (T & ContentHash) | null;