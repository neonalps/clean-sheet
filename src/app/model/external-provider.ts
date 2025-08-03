export enum ExternalProvider {
    Bundesliga = "bundesliga",
    Fotmob = "fotmob",
    Sofascore = "sofascore",
    User = "user",
    Weltfussball = "weltfussball",
}

export interface ExternalProviderLinkDto {
    provider: ExternalProvider;
    link: string;
}