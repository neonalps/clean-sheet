import { Injectable } from "@angular/core";
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

    constructor(private readonly translationService: TranslationService) {}

    private static flags: Map<string, string> = new Map([
        ['at', '🇦🇹'],
        ['dk', '🇩🇰'],
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