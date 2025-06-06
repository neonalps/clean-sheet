import { SelectOption } from "@src/app/component/select/option";
import { ExternalSearchResultItemDto } from "@src/app/model/external-search";

export function convertExternalSearchItemToSelectOption(item: ExternalSearchResultItemDto): SelectOption {
    return {
        id: item.entityId,
        name: item.title,
        icon: item.icon,
        type: item.type,
    }
}