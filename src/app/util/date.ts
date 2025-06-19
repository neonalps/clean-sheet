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

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export function getNumberOfDaysBetween(first: Date, second: Date): number {
    return Math.round(Math.abs((first.getTime() - second.getTime()) / ONE_DAY_IN_MILLISECONDS));
}