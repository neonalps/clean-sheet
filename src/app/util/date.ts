export function getDateFromUnixTimestamp(unix: number): Date {
    return new Date(unix * 1000);
}

export function getUnixTimestampFromDate(input: Date): number {
    return Math.floor(input.getTime() / 1000);
}

export function getCurrentUnix(): number {
    return getUnixTimestampFromDate(new Date());
}

export function isToday(input: Date): boolean {
    const today = new Date();

    return input.getFullYear() === today.getFullYear() &&
        input.getMonth() === today.getMonth() &&
        input.getDate() === today.getDate();
}