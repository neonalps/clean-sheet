import { SelectOption } from "./option";

export interface OptionConverter<T> {
    convert(input: T): SelectOption;
}