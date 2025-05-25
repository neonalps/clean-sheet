export const environment = {
    production: true,
    apiBaseUrl: "http://localhost:3024/api",
    oauth: {
        spotify: {
            authorizeUrl: "https://accounts.spotify.com/authorize",
            clientId: "fb41df894f1444d79b40f7dacf0e21d3",
            redirectUri: "https://on-repeat.neonalps.at/oauth/spotify",
        },
    },
};
