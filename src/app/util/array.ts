import { isDefined, isNotDefined } from "./common";

export function findOrThrow<T>(array: Array<T>, predicate: (item: T) => boolean, errorMessage?: string): T {
    const element = array.find(predicate);
    if (isNotDefined(element)) {
        throw new Error(errorMessage ?? `Failed to find element`);
    }
    return element as T;
}

export function groupBy<K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V[]> {
    const result = new Map();
    list.forEach((item: V) => {
        const key: K = keyGetter(item);
        const collection: V[] = result.get(key);
        if (isDefined(collection)) {
            collection.push(item);
        } else {
            result.set(key, [item]);
        }
    });
    return result;
}