export function encode(input: any): string {
    return btoa(input);
}

export function decode(input: string): any {
    return atob(input);
}