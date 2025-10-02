import { DateFormat, GameMinuteFormat, Language, ScoreFormat } from "./account";

export enum AccountRole {
    Subsitute = 'substitute',
    Player = 'player',
    Manager = 'manager',
}

export interface Identity {
    email: string;
    publicId: string;
    role: AccountRole;
}

export interface ProfileSettings {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    gameMinuteFormat: GameMinuteFormat;
}

export interface AuthResponse {
    identity: Identity;
    profileSettings: ProfileSettings;
    token: TokenResponse;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}