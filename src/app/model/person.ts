import { DateString, PersonId } from "@src/app/util/domain-types";
import { ExternalProvider } from "./external-provider";

export interface Person {
    id: PersonId;
    lastName: string;
    firstName?: string;
    avatar?: string;
    birthday?: DateString;
    deathday?: DateString;
    nationalities?: string[];
}

export interface SmallPerson {
    id: PersonId;
    lastName: string;
    firstName?: string;
    avatar?: string;
}

export interface DetailedPerson {
    id: PersonId;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday?: DateString;
    deathday?: DateString;
    nationalities?: string[];
}

export interface PersonInput {
    personId?: PersonId;
    externalPerson?: ExternalPerson;
}

export interface ExternalPerson {
    provider: ExternalProvider;
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    birthday?: Date;
}