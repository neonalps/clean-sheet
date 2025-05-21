import { Injectable } from "@angular/core";
import { Season } from "@src/app/model/season";
import { FetchHandle, FetchService, FetchStrategy } from "@src/app/module/fetch/service";

@Injectable({
    providedIn: 'root'
})
export class SeasonService {

    private seasonsFetchHandle: FetchHandle | undefined;
    private seasons: Season[] = [];

    constructor(private readonly fetchService: FetchService) {}

    init(): void {
        this.seasonsFetchHandle = this.fetchService.subscribe<Season[]>({
            name: 'GetSeasons',
            request: {
                method: 'GET',
                url: `/api/v1/seasons`,
            },
            bestBeforeSeconds: 10,        // 12 hours
            strategy: FetchStrategy.CacheAndNetwork,
            onUpdate: (update: Season[]) => this.onNewDataAvailable(update), 
        });

        this.seasonsFetchHandle.fetch();
    }

    private onNewDataAvailable(updatedSeasons: Season[]): void {
        console.log('SeasonService: received seasons', updatedSeasons);
        this.seasons = updatedSeasons;
    }

}