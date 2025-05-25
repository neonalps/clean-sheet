export type OptionId = string | number;

export type SelectOption = {
    id: OptionId;
    name: string;
    icon?: string;
    type?: string;
}