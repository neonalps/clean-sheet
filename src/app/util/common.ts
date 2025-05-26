export function isDefined<T>(toCheck: T): toCheck is NonNullable<T> {
    return toCheck !== null && toCheck !== undefined;
}

export function assertDefined<T>(toCheck: T, errorMessage?: string) {
    if (!isDefined(toCheck)) {
        throw new Error(errorMessage ?? `expected input to be defined but it was not`);
    }
}

export function getHtmlInputElementFromEvent(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
}