import { SelectOption } from "@src/app/component/select/option";
import { ExternalSearchResultItemDto } from "@src/app/model/external-search";
import { UiIconType } from "@src/app/model/icon";

export function convertExternalSearchItemToSelectOption(item: ExternalSearchResultItemDto): SelectOption {
    const option: SelectOption = {
        id: item.entityId,
        name: item.title,
        type: item.type,
    }

    if (item.icon) {
        option.icon = {
            type: item.type as UiIconType,
            content: item.icon,
        }
    }

    return option;
}