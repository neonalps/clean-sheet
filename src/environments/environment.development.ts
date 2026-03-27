export const environment = {
    production: false,
    apiBaseUrl: "http://localhost:3024/api",
    frontendBaseUrl: "http://localhost:4200",
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
            flavors: [
                {
                    id: 49,
                    name: 'Merkur Arena',
                },
                {
                    id: 118,
                    name: 'Arnold-Schwarzenegger-Stadion',
                },
                {
                    id: 119,
                    name: 'Stadion Liebenau',
                },
                {
                    id: 117,
                    name: 'UPC-Arena',
                }
            ],
        },
    },
    oauth: {
        google: {
            clientId: "984243160947-36q75qghqgc386gpusdg71jqc653kng6.apps.googleusercontent.com",
            redirectUri: "http://localhost:4200/oauth/google",
        },
    },
};
