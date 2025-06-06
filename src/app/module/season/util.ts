import { SelectOption } from "@src/app/component/select/option";
import { Season } from "@src/app/model/season";

export function convertSeasonToSelectOption(season: Season): SelectOption {
    return {
        id: season.id,
        name: season.name,
    }
}