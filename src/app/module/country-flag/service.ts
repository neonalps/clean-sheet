import { inject, Injectable } from "@angular/core";
import { TranslationService } from "@src/app/module/i18n/translation.service";
import { isDefined, isNotDefined } from "@src/app/util/common";

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

}