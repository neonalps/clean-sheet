import { SelectOption } from "@src/app/component/select/option";
import { GameListFilterType } from "./service";
import { TranslationService } from "@src/app/module/i18n/translation.service";

export function getGameListFilterTypeOptions(translationService: TranslationService): SelectOption[] {
    return [
      { id: GameListFilterType.HomeGame, name: translationService.translate(`filter.homeGame`) },
      { id: GameListFilterType.AwayGame, name: translationService.translate(`filter.awayGame`) },
      { id: GameListFilterType.Competition, name: translationService.translate(`filter.competition`) },
      { id: GameListFilterType.DomesticGame, name: translationService.translate(`filter.domesticGame`) },
      { id: GameListFilterType.InternationalGame, name: translationService.translate(`filter.internationalGame`) },
      { id: GameListFilterType.ComeFromBehindWin, name: translationService.translate(`filter.comeFromBehindWin`) },
      { id: GameListFilterType.WinInInjuryTime, name: translationService.translate(`filter.winInInjuryTime`) },
      { id: GameListFilterType.LossAfterLead, name: translationService.translate(`filter.lossAfterLead`) },
      { id: GameListFilterType.LossInInjuryTime, name: translationService.translate(`filter.lossInInjuryTime`) },
      { id: GameListFilterType.AccountAttended, name: translationService.translate(`filter.accountAttended`) },
      { id: GameListFilterType.AccountStarred, name: translationService.translate(`filter.accountStarred`) },
    ]
  }