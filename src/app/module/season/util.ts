import { SelectOption } from "@src/app/components/select/option";
import { Season } from "@src/app/model/season";

export function convertToSelectOption(season: Season): SelectOption {
    return {
        id: season.id,
        name: season.name,
    }
}