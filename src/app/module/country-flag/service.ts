import { inject, Injectable } from "@angular/core";
import { SelectOption } from "@src/app/component/select/option";
import { TranslationService } from "@src/app/module/i18n/translation.service";
import { ensureNotNullish, isDefined, isNotDefined } from "@src/app/util/common";

export type CountryFlag = {
    flag: string;
    title: string;
}

@Injectable({
    providedIn: 'root'
})
export class CountryFlagService {

    private readonly translationService = inject(TranslationService);

    private static flags: Map<string, string> = new Map([
        ['ad', '🇦🇩'],
        ['al', '🇦🇱'],
        ['ar', '🇦🇷'],
        ['at', '🇦🇹'],
        ['au', '🇦🇺'],
        ['az', '🇦🇿'],
        ['ba', '🇧🇦'],
        ['be', '🇧🇪'],
        ['bg', '🇧🇬'],
        ['br', '🇧🇷'],
        ['by', '🇧🇾'],
        ['cd', '🇨🇩'],
        ['ch', '🇨🇭'],
        ['ci', '🇨🇮'],
        ['cl', '🇨🇱'],
        ['cm', '🇨🇲'],
        ['cr', '🇨🇷'],
        ['cv', '🇨🇻'],
        ['cy', '🇨🇾'],
        ['cz', '🇨🇿'],
        ['de', '🇩🇪'],
        ['dk', '🇩🇰'],
        ['ee', '🇪🇪'],
        ['es', '🇪🇸'],
        ['fi', '🇫🇮'],
        ['fo', '🇫🇴'],
        ['fr', '🇫🇷'],
        ['gb-eng', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
        ['gb-nir', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
        ['gb-sct', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
        ['ge', '🇬🇪󠁧'],
        ['gh', '🇬🇭'],
        ['gr', '🇬🇷'],
        ['hr', '🇭🇷'],
        ['hu', '🇭🇺'],
        ['ie', '🇮🇪'],
        ['il', '🇮🇱'],
        ['ir', '🇮🇷'],
        ['is', '🇮🇸'],
        ['it', '🇮🇹'],
        ['jp', '🇯🇵'],
        ['kr', '🇰🇷'],
        ['lt', '🇱🇹'],
        ['lu', '🇱🇺'],
        ['lv', '🇱🇻'],
        ['me', '🇲🇪'],
        ['mk', '🇲🇰'],
        ['ml', '🇲🇱'],
        ['ng', '🇳🇬'],
        ['nl', '🇳🇱'],
        ['no', '🇳🇴'],
        ['pl', '🇵🇱'],
        ['pt', '🇵🇹'],
        ['ro', '🇷🇴'],
        ['rs', '🇷🇸'],
        ['ru', '🇷🇺'],
        ['se', '🇸🇪'],
        ['si', '🇸🇮'],
        ['sk', '🇸🇰'],
        ['sm', '🇸🇲'],
        ['tn', '🇹🇳'],
        ['tr', '🇹🇷'],
        ['tz', '🇹🇿'],
        ['ua', '🇺🇦'],
        ['uy', '🇺🇾'],
        ['ve', '🇻🇪'],
        ['xk', '🇽🇰'],
        ['zm', '🇿🇲'],
    ]);

    resolveNationalities(nationalities: string[]): CountryFlag[] {
        return nationalities.map(alpha2 => {
            const flag = CountryFlagService.flags.get(alpha2);
            if (isNotDefined(flag)) {
                return null;
            }
            return {
                flag: flag,
                title: this.translationService.translate(`country.${alpha2}`),
            };
        }).filter(item => isDefined(item));
    }

    getSelectOptions(exclude: string[] = []): SelectOption[] {
        return [...CountryFlagService.flags.keys()]
            .filter(flagKey => !exclude.includes(flagKey))
            .map(flagKey => {
                const entry = ensureNotNullish(CountryFlagService.flags.get(flagKey));
                return [flagKey, entry, this.translationService.translate(`country.${flagKey}`)];
            })
            .sort((a, b) => {
                const first = a[2].toLocaleUpperCase();
                const second = b[2].toLocaleUpperCase();
                return (first < second) ? -1 : (first > second) ? 1 : 0;
            })
            .map(([iso2, flag, translatedName]) => ({ id: iso2, name: `${flag}  ${translatedName}` }));
    }

}