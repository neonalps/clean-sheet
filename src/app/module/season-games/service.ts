import { Injectable, OnDestroy } from "@angular/core";
import { DetailedGame } from "@src/app/model/game";
import { FetchHandle, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { assertDefined } from "@src/app/util/common";
import { Observable, Subject } from "rxjs";

export type SeasonGamesUpdate = {
    seasonId: number;
    games: DetailedGame[];
}

@Injectable({
    providedIn: 'root'
})
export class SeasonGamesService implements OnDestroy {

    private fetchHandles: Map<number, FetchHandle> = new Map();
    private seasonGamesSubject = new Subject<SeasonGamesUpdate>();

    constructor(private readonly fetchService: FetchService) {}

    ngOnDestroy(): void {
        this.seasonGamesSubject.complete();
        for (const handle of this.fetchHandles.values()) {
            handle.unsubscribe();
        }
    }

    async getSeasonGames(seasonId: number): Promise<void> {
        this.getOrCreateFetchHandle(seasonId).fetch();
    }

    getSeasonGamesObservable(): Observable<SeasonGamesUpdate> {
        return this.seasonGamesSubject.asObservable();
    }

    getSeasonGamesFromCache(seasonId: number): Promise<DetailedGame[] | undefined> {
        return this.fetchService.getFromCache(this.getGetSeasonGamesRequestName(seasonId));
    } 

    private getOrCreateFetchHandle(seasonId: number): FetchHandle {
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