export function isDefined<T>(toCheck: T): toCheck is NonNullable<T> {
    return toCheck !== null && toCheck !== undefined;
}

export function getHtmlInputElementFromEvent(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
}