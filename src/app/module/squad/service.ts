import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { SmallPerson } from "@src/app/model/person";
import { GetActiveSquadResponse } from "@src/app/model/squad";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";

@Injectable({
  providedIn: 'root'
})
export class SquadService implements OnDestroy {

    private readonly activeSquad = signal<SmallPerson[]>([]);

    readonly activeSquad$ = toObservable(this.activeSquad);

    private readonly getActiveSquadFetchHandle: FetchHandle;

    private readonly fetchService = inject(FetchService);

    constructor() {
        this.getActiveSquadFetchHandle = this.fetchService.subscribe({
            name: 'GetActiveSquad',
            request: {
                method: 'GET',
                url: `/v1/squad`,
            },
            bestBeforeSeconds: 60 * 60 * 24,        // 1 day
            strategy: FetchStrategy.CacheAndNetwork,
            scope: FetchScope.Global,
            onUpdate: (update: GetActiveSquadResponse) => this.onActiveSquadUpdate(update), 
        });
    }

    ngOnDestroy(): void {
        this.getActiveSquadFetchHandle.unsubscribe();
    }

    fetch(): void {
        this.getActiveSquadFetchHandle.fetch();
    }

    private onActiveSquadUpdate(update: GetActiveSquadResponse) {
        console.log('active squad update', update);
        this.activeSquad.set([...update.activeSquadMembers]);
    }

}