import { UiPerson } from "@src/app/model/game";
import { isDefined } from "./common";

export function getPersonName(person: UiPerson): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
}