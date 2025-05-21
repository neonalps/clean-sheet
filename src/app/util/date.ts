export function getUnixTimestampFromDate(input: Date): number {
    return Math.floor(input.getTime() / 1000);
}

export function getCurrentUnix(): number {
    return getUnixTimestampFromDate(new Date());
}