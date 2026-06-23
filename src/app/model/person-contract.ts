import { Nullish } from "@src/app/util/types";
import { PersonContractId } from "@src/app/util/domain-types";

export interface ContractForPerson {
    id: PersonContractId;
    contractUntil: Nullish<Date>;
    onLoanUntil: Nullish<Date>;
}