import { isDefined } from "./common";

export function getPersonName(person: { firstName: string, lastName: string }): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
}