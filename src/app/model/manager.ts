import { DateString, ManagerPeriodId } from "@src/app/util/domain-types";
import { Person } from "./person";
import { RecordSummary } from "./game";
import { SeasonTitle } from "./season";

export interface ManagerPeriod {
    id: ManagerPeriodId;
    person: Person;
    start: DateString;
    end?: DateString;
    interim?: boolean;
    summary: RecordSummary;
    titles: SeasonTitle[];
}