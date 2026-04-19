import { DateString, ManagerPeriodId } from "@src/app/util/domain-types";
import { Person } from "./person";

export interface ManagerPeriod {
    id: ManagerPeriodId;
    person: Person;
    start: DateString;
    end?: DateString;
    interim?: boolean;
}