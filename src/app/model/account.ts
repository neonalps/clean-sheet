import { DateString } from "@src/app/util/domain-types";
import { AccountRole } from "./auth";

export enum Language {
    AustrianGerman = 'de-at',
    BritishEnglish = 'en-gb',
}

export enum DateFormat {
    American = "us",
    British = "br",
    European = "eu",
}

export enum ScoreFormat {
    Colon = "colon",
    Hyphen = "hyphen",
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
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    role: AccountRole;
    createdAt: DateString;
}

export interface UpdateAccountProfile {
    firstName: string;
    lastName: string;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
}