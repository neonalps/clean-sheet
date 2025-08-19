export interface Identity {
    email: string;
    publicId: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    identity: Identity;
    token: {
        accessToken: string;
        refreshToken: string;
    }
}