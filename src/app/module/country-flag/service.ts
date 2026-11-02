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
        ['ae', '🇦🇪'],
        ['af', '🇦🇫'],
        ['ag', '🇦🇬'],
        ['al', '🇦🇱'],
        ['am', '🇦🇲'],
        ['ao', '🇦🇴'],
        ['ar', '🇦🇷'],
        ['at', '🇦🇹'],
        ['au', '🇦🇺'],
        ['az', '🇦🇿'],
        ['ba', '🇧🇦'],
        ['bb', '🇧🇧'],
        ['bd', '🇧🇩'],
        ['be', '🇧🇪'],
        ['bf', '🇧🇫'],
        ['bg', '🇧🇬'],
        ['bh', '🇧🇭'],
        ['bi', '🇧🇮'],
        ['bj', '🇧🇯'],
        ['bn', '🇧🇳'],
        ['bo', '🇧🇴'],
        ['br', '🇧🇷'],
        ['bs', '🇧🇸'],
        ['bt', '🇧🇹'],
        ['bw', '🇧🇼'],
        ['by', '🇧🇾'],
        ['bz', '🇧🇿'],
        ['ca', '🇨🇦'],
        ['cd', '🇨🇩'],
        ['cf', '🇨🇫'],
        ['cg', '🇨🇬'],
        ['ch', '🇨🇭'],
        ['ci', '🇨🇮'],
        ['cl', '🇨🇱'],
        ['cm', '🇨🇲'],
        ['cn', '🇨🇳'],
        ['co', '🇨🇴'],
        ['cr', '🇨🇷'],
        ['cu', '🇨🇺'],
        ['cv', '🇨🇻'],
        ['cy', '🇨🇾'],
        ['cz', '🇨🇿'],
        ['de', '🇩🇪'],
        ['dj', '🇩🇯'],
        ['dk', '🇩🇰'],
        ['dm', '🇩🇲'],
        ['do', '🇩🇴'],
        ['dz', '🇩🇿'],
        ['ec', '🇪🇨'],
        ['ee', '🇪🇪'],
        ['eg', '🇪🇬'],
        ['es', '🇪🇸'],
        ['et', '🇪🇹'],
        ['fi', '🇫🇮'],
        ['fj', '🇫🇯'],
        ['fm', '🇫🇲'],
        ['fo', '🇫🇴'],
        ['fr', '🇫🇷'],
        ['ga', '🇬🇦'],
        ['gb-eng', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
        ['gb-nir', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
        ['gb-sct', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
        ['gd', '🇬🇩'],
        ['ge', '🇬🇪󠁧'],
        ['gh', '🇬🇭'],
        ['gi', '🇬🇮'],
        ['gm', '🇬🇲'],
        ['gn', '🇬🇳'],
        ['gq', '🇬🇶'],
        ['gr', '🇬🇷'],
        ['gt', '🇬🇹'],
        ['gw', '🇬🇼'],
        ['gy', '🇬🇾'],
        ['hn', '🇭🇳'],
        ['hr', '🇭🇷'],
        ['ht', '🇭🇹'],
        ['hu', '🇭🇺'],
        ['id', '🇮🇩'],
        ['ie', '🇮🇪'],
        ['il', '🇮🇱'],
        ['in', '🇮🇳'],
        ['iq', '🇮🇶'],
        ['ir', '🇮🇷'],
        ['is', '🇮🇸'],
        ['it', '🇮🇹'],
        ['jm', '🇯🇲'],
        ['jo', '🇯🇴'],
        ['jp', '🇯🇵'],
        ['ke', '🇰🇪'],
        ['kg', '🇰🇬'],
        ['kh', '🇰🇭'],
        ['ki', '🇰🇮'],
        ['km', '🇰🇲'],
        ['kn', '🇰🇳'],
        ['kp', '🇰🇵'],
        ['kr', '🇰🇷'],
        ['kw', '🇰🇼'],
        ['kz', '🇰🇿'],
        ['la', '🇱🇦'],
        ['lb', '🇱🇧'],
        ['lc', '🇱🇨'],
        ['li', '🇱🇮'],
        ['lk', '🇱🇰'],
        ['lr', '🇱🇷'],
        ['ls', '🇱🇸'],
        ['lt', '🇱🇹'],
        ['lu', '🇱🇺'],
        ['lv', '🇱🇻'],
        ['ly', '🇱🇾'],
        ['mc', '🇲🇨'],
        ['md', '🇲🇩'],
        ['me', '🇲🇪'],
        ['mg', '🇲🇬'],
        ['mh', '🇲🇭'],
        ['mk', '🇲🇰'],
        ['ml', '🇲🇱'],
        ['mm', '🇲🇲'],
        ['mn', '🇲🇳'],
        ['mr', '🇲🇷'],
        ['mt', '🇲🇹'],
        ['mu', '🇲🇺'],
        ['mv', '🇲🇻'],
        ['mw', '🇲🇼'],
        ['mx', '🇲🇽'],
        ['my', '🇲🇾'],
        ['mz', '🇲🇿'],
        ['na', '🇳🇦'],
        ['ne', '🇳🇪'],
        ['ng', '🇳🇬'],
        ['ni', '🇳🇮'],
        ['nl', '🇳🇱'],
        ['no', '🇳🇴'],
        ['np', '🇳🇵'],
        ['nr', '🇳🇷'],
        ['nz', '🇳🇿'],
        ['om', '🇴🇲'],
        ['pa', '🇵🇦'],
        ['pe', '🇵🇪'],
        ['pg', '🇵🇬'],
        ['ph', '🇵🇭'],
        ['pk', '🇵🇰'],
        ['pl', '🇵🇱'],
        ['pt', '🇵🇹'],
        ['pw', '🇵🇼'],
        ['py', '🇵🇾'],
        ['qa', '🇶🇦'],
        ['ro', '🇷🇴'],
        ['rs', '🇷🇸'],
        ['ru', '🇷🇺'],
        ['rw', '🇷🇼'],
        ['sa', '🇸🇦'],
        ['sb', '🇸🇧'],
        ['sc', '🇸🇨'],
        ['sd', '🇸🇩'],
        ['se', '🇸🇪'],
        ['sg', '🇸🇬'],
        ['si', '🇸🇮'],
        ['sk', '🇸🇰'],
        ['sl', '🇸🇱'],
        ['sm', '🇸🇲'],
        ['sn', '🇸🇳'],
        ['so', '🇸🇴'],
        ['sr', '🇸🇷'],
        ['ss', '🇸🇸'],
        ['st', '🇸🇹'],
        ['sv', '🇸🇻'],
        ['sy', '🇸🇾'],
        ['sz', '🇸🇿'],
        ['td', '🇹🇩'],
        ['tg', '🇹🇬'],
        ['th', '🇹🇭'],
        ['tj', '🇹🇯'],
        ['tl', '🇹🇱'],
        ['tm', '🇹🇲'],
        ['tn', '🇹🇳'],
        ['to', '🇹🇴'],
        ['tr', '🇹🇷'],
        ['tt', '🇹🇹'],
        ['tv', '🇹🇻'],
        ['tz', '🇹🇿'],
        ['ua', '🇺🇦'],
        ['ug', '🇺🇬'],
        ['us', '🇺🇸'],
        ['uy', '🇺🇾'],
        ['uz', '🇺🇿'],
        ['va', '🇻🇦'],
        ['vc', '🇻🇨'],
        ['ve', '🇻🇪'],
        ['vn', '🇻🇳'],
        ['vu', '🇻🇺'],
        ['ws', '🇼🇸'],
        ['xk', '🇽🇰'],
        ['ye', '🇾🇪'],
        ['za', '🇿🇦'],
        ['zm', '🇿🇲'],
        ['zw', '🇿🇼'],
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
        const orderedOptions = [...CountryFlagService.flags.keys()]
            .filter(flagKey => !exclude.includes(flagKey))
            .map(flagKey => {
                const entry = ensureNotNullish(CountryFlagService.flags.get(flagKey));
                return [flagKey, entry, this.translationService.translate(`country.${flagKey}`)];
            })
            .sort((a, b) => a[2].localeCompare(b[2], 'de', { sensitivity: 'base' }))
            .map(([iso2, flag, translatedName]) => ({ id: iso2, name: `${flag}  ${translatedName}` }));

        // move preferred country to the top
        const preferredCountryIndex = orderedOptions.findIndex(item => item.id === 'at');
        if (preferredCountryIndex >= 0) {
            const [preferredCountry] = orderedOptions.splice(preferredCountryIndex, 1);
            orderedOptions.unshift(preferredCountry);
        }

        return orderedOptions;
    }

}