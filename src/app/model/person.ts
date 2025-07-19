import { ExternalProvider } from "./external-provider";

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface DetailedPerson {
    id: number;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday: Date;
    deathday?: Date;
    nationalities?: string[];
}

export interface PersonInput {
    personId?: number;
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