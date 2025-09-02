import { DateString } from "@src/app/util/domain-types";
import { AccountRole } from "./auth";

export enum Language {
    AustrianGerman = 'de-at',
    BritishEnglish = 'en-gb',
}

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

export interface AccountProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    language: Language;
    role: AccountRole;
    createdAt: DateString;
}