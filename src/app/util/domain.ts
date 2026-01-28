import { isDefined } from "./common";

export function getPersonName(person: { firstName: string, lastName: string }): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
}

export function getDisplayName(firstName: string | undefined, lastName: string | undefined): string {
    return [firstName, lastName].filter(item => isDefined(item)).join(' ');
}