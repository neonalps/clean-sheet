import { Injectable, OnDestroy } from "@angular/core";
import { FetchHandle, FetchScope, FetchService, FetchStrategy } from "@src/app/module/fetch/service";
import { BasicCompetition, CompetitionResponse } from "@src/app/model/competition";
import { filter, map, Observable, Subject } from "rxjs";
import { isDefined, isNotDefined } from "@src/app/util/common";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { HttpClient } from "@angular/common/http";
import { environment } from "@src/environments/environment";
import { CompetitionId } from "@src/app/util/domain-types";

@Injectable({
    providedIn: 'root'
})
export class CompetitionService implements OnDestroy {

    private static readonly REQUEST_COMPETITIONS = 'GetCompetitions';

    private competitionsFetchHandle: FetchHandle | undefined;

    private competitionsSubject = new Subject<BasicCompetition[]>();

    constructor(
        private readonly fetchService: FetchService,
        private readonly http: HttpClient,
    ) {}

    ngOnDestroy(): void {
        this.competitionsFetchHandle?.unsubscribe();
    }

    init(): void {
        this.competitionsFetchHandle = this.fetchService.subscribe<BasicCompetition[]>({
            name: CompetitionService.REQUEST_COMPETITIONS,
            request: {
                method: 'GET',
                url: `/v1/competitions`,
            },
            bestBeforeSeconds: 24 * 60 * 60,        // 24 hours
            strategy: FetchStrategy.CacheAndNetwork,
            scope: FetchScope.Global,
            onUpdate: (update: BasicCompetition[]) => this.onCompetitionsUpdate(update),         
        });
        this.competitionsFetchHandle.fetch();
    }

    onCompetitionsUpdate(competitions: BasicCompetition[]) {
        this.competitionsSubject.next(competitions);
    }

    getCompetitionsObservable(): Observable<BasicCompetition[]> {
        return this.competitionsSubject.asObservable();
    }

    getCompetitionById(competitionId: CompetitionId): Observable<CompetitionResponse> {
        return this.http.get<CompetitionResponse>(`${environment.apiBaseUrl}/v1/competitions/${competitionId}`);
    }

    getOrderedCompetitionsFromCache(): Observable<BasicCompetition[]> {
        return fromPromise(this.fetchService.getFromCache<BasicCompetition[]>(CompetitionService.REQUEST_COMPETITIONS)).pipe(
            filter(value => isDefined(value)),
        );
    }

    getOrderedTopLevelCompetitionsFromCache(): Observable<BasicCompetition[]> {
        return this.getOrderedCompetitionsFromCache().pipe(
            map(competitions => competitions.filter(item => this.isTopLevelCompetition(item))),
        );
    }

    getTopLevelCompetitionsObservable(): Observable<BasicCompetition[]> {
        return this.getCompetitionsObservable().pipe(
            map(competitions => competitions.filter(item => this.isTopLevelCompetition(item))),
        );
    }

    private isTopLevelCompetition(competition: BasicCompetition): boolean {
        return isNotDefined(competition.parentCompetitionId) || (isDefined(competition.parentCompetitionId) && competition.combineStatisticsWithParent !== true);
    }


}