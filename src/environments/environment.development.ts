export const environment = {
    production: false,
    apiBaseUrl: "http://localhost:3024",
    oauth: {
        spotify: {
            authorizeUrl: "https://accounts.spotify.com/authorize",
            clientId: "fb41df894f1444d79b40f7dacf0e21d3",
            redirectUri: "http://localhost:4200/oauth/spotify",
        },
    },
};
