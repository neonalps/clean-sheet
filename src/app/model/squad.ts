import { DetailedPerson, SmallPerson } from "./person";

export enum OverallPosition {
    Goalkeeper = "goalkeeper",
    Defender = "defender",
    Midfielder = "midfielder",
    Forward = "forward",
}

export interface SquadMember {
    id: number;
    player: DetailedPerson;
    shirt?: number;
    from?: string;
    to?: string;
    loan?: boolean;
}

export interface GetActiveSquadResponse {
    activeSquadMembers: SmallPerson[];
}