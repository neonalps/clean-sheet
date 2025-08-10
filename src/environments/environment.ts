export const environment = {
    production: true,
    apiBaseUrl: "https://liebenau.neonalps.at/api",
    frontendBaseUrl: "https://1909.neonalps.at",
    mainClub: {
        id: 1,
        name: "SK Sturm Graz",
        shortName: "Sturm Graz",
        iconSmall: "https://neonalps.b-cdn.net/c/1.png",
        city: 'Graz',
        countryCode: 'at',
        homeVenue: {
            id: 2,
            name: 'Merkur Arena',
            shortName: 'Merkur Arena',
            city: 'Graz',
            countryCode: 'at',
            capacity: 16764,
        }
    },
    oauth: {
        google: {
            authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            clientId: "984243160947-36q75qghqgc386gpusdg71jqc653kng6.apps.googleusercontent.com",
            redirectUri: "https://1909.neonalps.at/oauth/google",
        },
    },
};
