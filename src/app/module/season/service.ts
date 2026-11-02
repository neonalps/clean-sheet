import { inject, Injectable, signal } from "@angular/core";
import { Season } from "@src/app/model/season";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { isDefined } from "@src/app/util/common";
import { Observable, BehaviorSubject, filter } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

@Injectable({
    providedIn: 'root'
})
export class SeasonService {

    private static readonly REQUEST_SEASONS = 'GetSeasons';
    
    private readonly fetchService = inject(FetchService);

    private seasonsFetchHandle: FetchHandle | undefined;
    private readonly seasons = signal<Season[]>([]);
    private readonly seasonsSubject = new BehaviorSubject<Season[]>([]);

    init(): void {
        this.seasonsFetchHandle = this.fetchService.subscribe<Season[]>({
            name: SeasonService.REQUEST_SEASONS,
            request: {
                method: 'GET',
                url: `/v1/seasons`,
            },
            bestBeforeSeconds: 12 * 60 * 60,        // 12 hours
            strategy: FetchStrategy.CacheAndNetwork,
            scope: FetchScope.Global,
            onUpdate: (update: Season[]) => this.onSeasonsUpdate(update), 
        });

        this.seasonsFetchHandle.fetch();
    }

    getCurrentSeason(): Season | null {
        return this.seasons()[0] ?? null;
    }

    getSeasons(): Season[] {
        return this.copyOfSeasons();
    }

    getSeasonsObservable(): Observable<Season[]> {
        return this.seasonsSubject.asObservable();
    }

    getOrderedSeasonsFromCache(): Observable<Season[]> {
        return fromPromise(this.fetchService.getFromCache<Season[]>(SeasonService.REQUEST_SEASONS)).pipe(
            filter(value => isDefined(value)),
        );
    }

    private onSeasonsUpdate(updatedSeasons: Season[]): void {
        const transformedSeasons = updatedSeasons.map((item, idx) => ({
            ...item,
            isCurrent: idx === 0,
        }));

        this.seasons.set(transformedSeasons);
        this.seasonsSubject.next(transformedSeasons);
    }

    private copyOfSeasons(): Season[] {
        return [...this.seasons()];
    }

}