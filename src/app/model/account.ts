import { DateString } from "@src/app/util/domain-types";
import { AccountRole } from "./auth";

export interface Account {
    id: number;
    publicId: string;
    email: string;
    enabled: boolean;
    firstName?: string;
    lastName?: string;
    role: AccountRole;
    createdAt: DateString;
}