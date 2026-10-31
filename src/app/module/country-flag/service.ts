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
        ['af', '🇦🇫'],
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
        ['ca', '🇨🇦'],
        ['cd', '🇨🇩'],
        ['ch', '🇨🇭'],
        ['ci', '🇨🇮'],
        ['cl', '🇨🇱'],
        ['cm', '🇨🇲'],
        ['co', '🇨🇴'],
        ['cr', '🇨🇷'],
        ['cv', '🇨🇻'],
        ['cy', '🇨🇾'],
        ['cz', '🇨🇿'],
        ['de', '🇩🇪'],
        ['dk', '🇩🇰'],
        ['ec', '🇪🇨'],
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
        ['gi', '🇬🇮'],
        ['gm', '🇬🇲'],
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
        ['li', '🇱🇮'],
        ['lk', '🇱🇰'],
        ['lt', '🇱🇹'],
        ['lu', '🇱🇺'],
        ['lv', '🇱🇻'],
        ['me', '🇲🇪'],
        ['mk', '🇲🇰'],
        ['ml', '🇲🇱'],
        ['mt', '🇲🇹'],
        ['mx', '🇲🇽'],
        ['my', '🇲🇾'],
        ['ng', '🇳🇬'],
        ['nl', '🇳🇱'],
        ['no', '🇳🇴'],
        ['pe', '🇵🇪'],
        ['pl', '🇵🇱'],
        ['pt', '🇵🇹'],
        ['py', '🇵🇾'],
        ['ro', '🇷🇴'],
        ['rs', '🇷🇸'],
        ['ru', '🇷🇺'],
        ['rw', '🇷🇼'],
        ['se', '🇸🇪'],
        ['si', '🇸🇮'],
        ['sk', '🇸🇰'],
        ['sm', '🇸🇲'],
        ['sn', '🇸🇳'],
        ['tn', '🇹🇳'],
        ['tr', '🇹🇷'],
        ['tz', '🇹🇿'],
        ['ua', '🇺🇦'],
        ['us', '🇺🇸'],
        ['uy', '🇺🇾'],
        ['ve', '🇻🇪'],
        ['xk', '🇽🇰'],
        ['za', '🇿🇦'],
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
            .sort((a, b) => a[2].localeCompare(b[2], 'de', { sensitivity: 'base' }))
            .map(([iso2, flag, translatedName]) => ({ id: iso2, name: `${flag}  ${translatedName}` }));
    }

}