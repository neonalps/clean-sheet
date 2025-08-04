import { Injectable, OnDestroy } from "@angular/core";
import { Season } from "@src/app/model/season";
import { FetchHandle, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SeasonService implements OnDestroy {

    private seasonsFetchHandle: FetchHandle | undefined;
    private seasons: Season[] = [];
    private seasonsSubject = new BehaviorSubject<Season[]>([]);

    constructor(private readonly fetchService: FetchService) {}

    ngOnDestroy(): void {
        this.seasonsSubject.complete();
        this.seasonsFetchHandle?.unsubscribe();
    }

    init(): void {
        this.seasonsFetchHandle = this.fetchService.subscribe<Season[]>({
            name: 'GetSeasons',
            request: {
                method: 'GET',
                url: `/v1/seasons`,
            },
            bestBeforeSeconds: 12 * 60 * 60,        // 12 hours
            strategy: FetchStrategy.CacheAndNetwork,
            onUpdate: (update: Season[]) => this.onSeasonsUpdate(update), 
        });

        this.seasonsFetchHandle.fetch();
    }

    getCurrentSeason(): Season | null {
        if (this.seasons.length === 0) {
            return null;
        }

        return this.seasons[0];
    }

    getSeasons(): Season[] {
        return this.copyOfSeasons();
    }

    getSeasonsObservable(): Observable<Season[]> {
        return this.seasonsSubject.asObservable();
    }

    private onSeasonsUpdate(updatedSeasons: Season[]): void {
        const transformedSeasons = updatedSeasons.map((item, idx) => ({
            ...item,
            isCurrent: idx === 0,
        }));

        console.log('SeasonService: received seasons', transformedSeasons);
        this.seasons = transformedSeasons;
        this.seasonsSubject.next(transformedSeasons);
    }

    private copyOfSeasons(): Season[] {
        return this.seasons.map(item => ({
            ...item,
        }));
    }

}