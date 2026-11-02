import { inject, Injectable, OnDestroy } from "@angular/core";
import { DetailedGame } from "@src/app/model/game";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { assertDefined } from "@src/app/util/common";
import { SeasonId } from "@src/app/util/domain-types";
import { Observable, Subject } from "rxjs";

export type SeasonGamesUpdate = {
    seasonId: number;
    games: DetailedGame[];
}

@Injectable({
    providedIn: 'root'
})
export class SeasonGamesService implements OnDestroy {

    private readonly fetchHandles: Map<SeasonId, FetchHandle> = new Map();
    private readonly seasonGamesSubject = new Subject<SeasonGamesUpdate>();

    private readonly fetchService = inject(FetchService);

    ngOnDestroy(): void {
        this.seasonGamesSubject.complete();
        for (const handle of this.fetchHandles.values()) {
            handle.unsubscribe();
        }
    }

    fetchSeasonGames(seasonId: SeasonId, forceFetch?: boolean): void {
        this.getOrCreateFetchHandle(seasonId).fetch(forceFetch);
    }

    getSeasonGamesObservable(): Observable<SeasonGamesUpdate> {
        return this.seasonGamesSubject.asObservable();
    }

    getSeasonGamesFromCache(seasonId: number): Promise<DetailedGame[] | undefined> {
        return this.fetchService.getFromCache(this.getGetSeasonGamesRequestName(seasonId));
    }

    private getOrCreateFetchHandle(seasonId: SeasonId): FetchHandle {
        const existingHandle = this.fetchHandles.get(seasonId);
        if (existingHandle !== undefined) {
            return existingHandle;
        }

        return this.registerFetchHandleForSeasonId(seasonId);
    }

    private registerFetchHandleForSeasonId(seasonId: number): FetchHandle {
        const fetchHandle = this.fetchService.subscribe<DetailedGame[]>({
            name: this.getGetSeasonGamesRequestName(seasonId),
            request: {
                method: 'GET',
                url: `/v1/seasons/${seasonId}/games?order=asc`,
            },
            bestBeforeSeconds: 60,
            strategy: FetchStrategy.CacheAndNetwork,
            scope: FetchScope.Global,
            onUpdate: (update: DetailedGame[]) => this.onSeasonGamesUpdate(seasonId, update), 
        });
        this.fetchHandles.set(seasonId, fetchHandle);
        return fetchHandle;
    }

    private onSeasonGamesUpdate(seasonId: number, games: DetailedGame[]): void {
        this.seasonGamesSubject.next({ seasonId, games }); 
    }

    private getGetSeasonGamesRequestName(seasonId: number) {
        assertDefined(seasonId, "seasonId");

        return `GetSeasonGames/${seasonId}`;
    }

}