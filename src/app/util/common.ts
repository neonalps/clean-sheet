import { TranslationService } from "@src/app/module/i18n/translation.service";

export function isDefined<T>(toCheck: T | undefined | null): toCheck is NonNullable<T> {
    return toCheck !== null && toCheck !== undefined;
}

export function isNotDefined<T>(toCheck: T | undefined | null): toCheck is undefined | null  {
    return !isDefined(toCheck);
}

export function assertDefined<T>(toCheck: T, errorMessage?: string) {
    if (!isDefined(toCheck)) {
        throw new Error(errorMessage ?? `expected input to be defined but it was not`);
    }
}

export function getHtmlInputElementFromEvent(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
}

const placeholderStart = "{t:";
const placeholderEnd = "}";
function resolveTranslationPlaceholder(input: string): Map<string, string> {
    const result: Map<string, string> = new Map();

    let remaining = input;

    while (true) {
        const nextPlaceholderPosition = remaining.indexOf(placeholderStart);
        if (nextPlaceholderPosition === -1) {
            return result;
        }

        const end = remaining.indexOf(placeholderEnd, nextPlaceholderPosition);
        if (end === -1) {
            throw new Error(`Found opening placeholder but no end placeholder`);
        }

        const translationKey = remaining.substring(nextPlaceholderPosition + placeholderStart.length, end);
        result.set(translationKey, [placeholderStart, translationKey, placeholderEnd].join(''));

        remaining = remaining.substring(end);
    }
}

export function processTranslationPlaceholders(input: string, translationService: TranslationService): string {
    const translationPlaceholders = resolveTranslationPlaceholder(input);
    let result = input;
    for (const [translationKey, placeholder] of translationPlaceholders.entries()) {
        result = result.replaceAll(placeholder, translationService.translate(translationKey));
    }
    return result;
}

export function assertUnreachable(x: never, errorMessage?: string): never {
  errorMessage ||= `This should be unreachable. Unexpected value ${JSON.stringify(x)}`;
  throw new Error(errorMessage);
}