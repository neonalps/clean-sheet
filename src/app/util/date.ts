export function getNow(): Date {
    return new Date();
}

export function getDateFromUnixTimestamp(unix: number): Date {
    return new Date(unix * 1000);
}

export function getUnixTimestampFromDate(input: Date): number {
    return Math.floor(input.getTime() / 1000);
}

export function getCurrentUnix(): number {
    return getUnixTimestampFromDate(new Date());
}

export function getLocalDateTimeString(value: Date): string {
    const localDate = new Date(value);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

    // remove the "Z" from the ISO string
    return localDate.toISOString().slice(0, -1);
}

export function isToday(input: Date): boolean {
    const today = new Date();

    return input.getFullYear() === today.getFullYear() &&
        input.getMonth() === today.getMonth() &&
        input.getDate() === today.getDate();
}

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export function getNumberOfDaysBetween(first: Date, second: Date): number {
    // set hours to midnight to avoid weird jumps depending the kickoff time during the day
    first.setHours(0, 0, 0, 0);
    second.setHours(0, 0, 0, 0);

    return Math.round((first.getTime() - second.getTime()) / ONE_DAY_IN_MILLISECONDS);
}

export function getAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    var m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}

export function getPaddedDateString(input: Date): string {
    return [
        input.getFullYear(),
        (input.getMonth() + 1).toString().padStart(2, '0'),
        input.getDate().toString().padStart(2, '0'),
    ].join('');
}