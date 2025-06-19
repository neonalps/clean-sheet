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