import { Nullish } from "@src/app/util/types";
import { DateString, PersonContractId } from "@src/app/util/domain-types";

export interface ContractForPerson {
    id: PersonContractId;
    contractUntil: Nullish<DateString>;
    onLoanUntil: Nullish<DateString>;
}