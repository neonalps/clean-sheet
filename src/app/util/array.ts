import { isNotDefined } from "./common";

export function findOrThrow<T>(array: Array<T>, predicate: (item: T) => boolean, errorMessage?: string): T {
    const element = array.find(predicate);
    if (isNotDefined(element)) {
        throw new Error(errorMessage ?? `Failed to find element`);
    }
    return element as T;
}