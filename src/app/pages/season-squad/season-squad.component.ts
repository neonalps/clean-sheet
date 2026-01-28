import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { SquadMemberComponent } from '@src/app/component/squad-member/squad-member.component';
import { Season } from '@src/app/model/season';
import { SquadMember } from '@src/app/model/squad';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { SeasonSquadService } from '@src/app/module/season-squad/service';
import { SeasonService } from '@src/app/module/season/service';
import { assertDefined } from '@src/app/util/common';
import { PersonId } from '@src/app/util/domain-types';
import { navigateToPerson, navigateToSeasonSquad, PATH_PARAM_SEASON_ID } from '@src/app/util/router';
import { BehaviorSubject, combineLatest, delay, filter, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { SeasonSelectComponent } from "@src/app/component/season-select/season-select.component";
import { Person } from '@src/app/model/person';
import { getDisplayName } from '@src/app/util/domain';

@Component({
  selector: 'app-season-squad',
  imports: [CommonModule, I18nPipe, SquadMemberComponent, SeasonSelectComponent],
  templateUrl: './season-squad.component.html',
  styleUrl: './season-squad.component.css'
})
export class SeasonSquadComponent implements OnInit, OnDestroy {

  seasons$: Observable<Season[]> | null = null;
  selectedSeason$ = new BehaviorSubject<SelectOption | null>(null);
  squadLoaded$ = new Subject<void>();

  readonly isLoading = signal(true);
  readonly selectedSeason = signal<Season | null>(null);

  readonly goalkeepers = signal<SquadMember[]>([]);
  readonly defenders = signal<SquadMember[]>([]);
  readonly midfielders = signal<SquadMember[]>([]);
  readonly forwards = signal<SquadMember[]>([]);

  private seasons: Season[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seasonService = inject(SeasonService);
  private readonly seasonSquadService = inject(SeasonSquadService);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value instanceof NavigationEnd && this.seasons.length > 0) { // trigger load only if we already have received the seasons
          this.loadSeasonSquad(this.getSeasonIdRouteParam());
        }
      });

    const routerScrollingPosition = this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((event): event is Scroll => event instanceof Scroll),
      map((event: Scroll) => event.position || undefined),
    );

    combineLatest([
      routerScrollingPosition,
      this.squadLoaded$,
    ]).pipe(delay(1), takeUntil(this.destroy$)).subscribe(([scrollPosition]) => {
      if (scrollPosition === undefined) {
        return;
      }

      this.viewportScroller.scrollToPosition([scrollPosition[0], scrollPosition[1]]);
    })
  }

  ngOnInit(): void {
    this.isLoading.set(true);

    this.seasonService.getSeasonsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(seasons => {
        this.seasons = seasons;

        if (seasons.length > 0) {
          this.seasons$ = of(seasons);
          this.loadSeasonSquad(this.getSeasonIdRouteParam());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSeasonSquad(seasonParam: string) {
    const season = seasonParam === 'current' ? this.seasons[0] : this.seasons.find(item => item.id === Number(seasonParam)) as Season;
    assertDefined(season, `failed to find season for param ${seasonParam}`);

    this.selectedSeason.set(season);
    this.selectedSeason$.next({
      id: season.id,
      name: season.name,
    });
    
    this.seasonSquadService.getSquadBySeasonId(season.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.goalkeepers.set(response.squad.goalkeeper);
        this.defenders.set(response.squad.defender);
        this.midfielders.set(response.squad.midfielder);
        this.forwards.set(response.squad.forward);

        this.isLoading.set(false);

        this.squadLoaded$.next();
      });
  }

  onMemberClicked(person: Person) {
    navigateToPerson(this.router, person.id, getDisplayName(person.firstName, person.lastName));
  }

  onSeasonSelected(seasonId: OptionId) {
      if (seasonId === this.selectedSeason()?.id) {
        return;
      }
  
      navigateToSeasonSquad(this.router, Number(seasonId));
    }

  private getSeasonIdRouteParam() {
    return this.route.snapshot.paramMap.get(PATH_PARAM_SEASON_ID) as string;
  }

}
