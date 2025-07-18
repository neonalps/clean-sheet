import { UiIconDescriptor } from "@src/app/model/icon";

export type OptionId = string | number;

export type SelectOption = {
    id: OptionId;
    name: string;
    icon?: UiIconDescriptor;
    type?: string;
}