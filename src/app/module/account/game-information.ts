import { inject, Injectable, signal } from "@angular/core";
import { AccountGameInformationResponse } from "@src/app/model/account";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { GameId } from "@src/app/util/domain-types";
import { AuthService } from "@src/app/module/auth/service";
import { Nullish } from "@src/app/util/types";

@Injectable({
  providedIn: 'root'
})
export class AccountGameInformationService {

    private readonly authService = inject(AuthService);
    private readonly fetchService = inject(FetchService);

    private readonly fetchHandle = signal<Nullish<FetchHandle>>(null);

    private readonly isInitialized = signal(false);

    private readonly attendedGames = signal<Set<GameId>>(new Set());
    private readonly starredGames = signal<Set<GameId>>(new Set());

    init() {
        if (this.isInitialized()) {
            throw new Error(`Account game information service must only be initialized once`);
        }

        this.isInitialized.set(true);

        this.authService.authIdentity$.subscribe({
            next: authIdentity => {
                if (authIdentity === null) {
                    this.fetchHandle()?.unsubscribe();
                    this.attendedGames.set(new Set());
                    this.starredGames.set(new Set());
                    this.fetchHandle.set(null);
                } else {
                    const handle = this.fetchService.subscribe<AccountGameInformationResponse>({
                        name: 'AccountGameInformation',
                        request: {
                            method: 'GET',
                            url: `/v1/account/game-information`,
                        },
                        bestBeforeSeconds: 0,
                        strategy: FetchStrategy.Network,
                        scope: FetchScope.Account,
                        onUpdate: (update: AccountGameInformationResponse) => {
                            this.attendedGames.set(new Set(update.attended));
                            this.starredGames.set(new Set(update.stars));
                        }, 
                    });

                    this.fetchHandle.set(handle);
                    handle.fetch();
                }
            },
            error: error => {
                console.error(`failed to fetch account game information`, error);
            },
        });
    }

    isAttended(gameId: GameId): boolean {
        return this.attendedGames().has(gameId);
    }

    isStarred(gameId: GameId): boolean {
        return this.starredGames().has(gameId);
    }

}