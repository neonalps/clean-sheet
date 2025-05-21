import { Injectable, OnDestroy } from "@angular/core";
import { Season } from "@src/app/model/season";
import { FetchHandle, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { BehaviorSubject, Observable } from "rxjs";

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
    }

    init(): void {
        this.seasonsFetchHandle = this.fetchService.subscribe<Season[]>({
            name: 'GetSeasons',
            request: {
                method: 'GET',
                url: `/api/v1/seasons`,
            },
            bestBeforeSeconds: 12 * 60 * 60,        // 12 hours
            strategy: FetchStrategy.CacheAndNetwork,
            onUpdate: (update: Season[]) => this.onSeasonsUpdate(update), 
        });

        this.seasonsFetchHandle.fetch();
    }

    getSeasons(): Season[] {
        return this.copyOfSeasons();
    }

    getSeasonsObservable(): Observable<Season[]> {
        return this.seasonsSubject.asObservable();
    }

    private onSeasonsUpdate(updatedSeasons: Season[]): void {
        console.log('SeasonService: received seasons', updatedSeasons);
        this.seasons = updatedSeasons;
        this.seasonsSubject.next(updatedSeasons);
    }

    private copyOfSeasons(): Season[] {
        return this.seasons.map(item => ({
            ...item,
        }));
    }

}