import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { ManagerPeriod } from "@src/app/model/manager";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";

@Injectable({
  providedIn: 'root'
})
export class ManagerPeriodService implements OnDestroy {

    private readonly currentManagerPeriods = signal<ManagerPeriod[]>([]);

    readonly managerPeriods$ = toObservable(this.currentManagerPeriods);

    private readonly getAllFetchHandle: FetchHandle;

    private readonly fetchService = inject(FetchService);

    constructor() {
        this.getAllFetchHandle = this.fetchService.subscribe({
            name: 'GetAllManagerPeriods',
            request: {
                method: 'GET',
                url: `/v1/managers/periods`,
            },
            bestBeforeSeconds: 60 * 60 * 24,        // 1 day
            strategy: FetchStrategy.CacheAndNetwork,
            scope: FetchScope.Global,
            onUpdate: (update: ManagerPeriod[]) => this.onManagerPeriodsUpdate(update), 
        });
    }

    ngOnDestroy(): void {
        this.getAllFetchHandle.unsubscribe();
    }

    fetch(): void {
        this.getAllFetchHandle.fetch();
    }

    private onManagerPeriodsUpdate(periods: ManagerPeriod[]) {
        this.currentManagerPeriods.set(periods);
    }

}