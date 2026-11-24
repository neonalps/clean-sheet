import { Ordinal } from "./translation.service";
import { assertDefined, isNotDefined } from "@src/app/util/common";

export type PluralKey = {
    key: string;
    pluralContext: Record<string, string | number | Ordinal>;
};

export function resolvePluralKey(input: string): PluralKey {
    assertDefined(input, "input");

    if (isNotDefined(input) || input.indexOf(':') < 0) {
        return { 
            key: input,
            pluralContext: {},
        };
    }

    const parts = input.split(':');
    if (parts.length !== 2) {
        throw new Error(`Plural keys must only contain one ':' character`);
    }

    return {
        key: parts[0],
        pluralContext: {
            plural: Number(parts[1]),
        },
    };
}