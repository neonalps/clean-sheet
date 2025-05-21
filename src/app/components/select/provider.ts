import { SelectOption } from "./option";

export interface OptionProvider {
    provide(input?: string): Promise<SelectOption[]>;
}