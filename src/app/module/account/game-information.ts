import { Injectable } from "@angular/core";
import { AccountGameInformationResponse } from "@src/app/model/account";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { GameId } from "@src/app/util/domain-types";

@Injectable({
  providedIn: 'root'
})
export class AccountGameInformationService {

    private readonly fetchHandle: FetchHandle;

    private attendedGames: Set<GameId> = new Set();
    private starredGames: Set<GameId> = new Set();

    constructor(private readonly fetchService: FetchService) {
        this.fetchHandle = this.fetchService.subscribe<AccountGameInformationResponse>({
            name: 'AccountGameInformation',
            request: {
                method: 'GET',
                url: `/v1/account/game-information`,
            },
            bestBeforeSeconds: 0,
            strategy: FetchStrategy.Network,
            scope: FetchScope.Account,
            onUpdate: (update: AccountGameInformationResponse) => {
                console.log('received account game information');

                this.attendedGames = new Set(update.attended);
                this.starredGames = new Set(update.stars);
            }, 
        });
        this.fetchHandle.fetch();
    }

    init() {
        console.log('account game information initialized');
    }

    isAttended(gameId: GameId): boolean {
        return this.attendedGames.has(gameId);
    }

    isStarred(gameId: GameId): boolean {
        return this.starredGames.has(gameId);
    }

}