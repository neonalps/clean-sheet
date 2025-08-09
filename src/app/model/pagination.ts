export enum SortOrder {
    Ascending = "asc",
    Descending = "desc",
};

export interface PaginatedResponse<T> {
    items: T[];
    nextPageKey?: string;
}

export interface PaginationQueryParams {
    nextPageKey?: string;
    limit?: number;
    order?: SortOrder;
}