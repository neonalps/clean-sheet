export enum AccountRole {
    Subsitute = 'substitute',
    Player = 'player',
    Manager = 'manager',
}

export interface Identity {
    email: string;
    publicId: string;
    firstName?: string;
    lastName?: string;
    role: AccountRole;
}

export interface AuthResponse {
    identity: Identity;
    token: TokenResponse;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}