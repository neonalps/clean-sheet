export interface SmallCompetition {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    parent?: SmallCompetition;
}