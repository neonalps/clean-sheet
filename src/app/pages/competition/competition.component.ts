import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CompetitionResponse } from '@src/app/model/competition';
import { CompetitionService } from '@src/app/module/competition/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ToastService } from '@src/app/module/toast/service';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { CompetitionId } from '@src/app/util/domain-types';
import { parseUrlSlug, PATH_PARAM_COMPETITION_ID } from '@src/app/util/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-competition',
  imports: [],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css'
})
export class CompetitionComponent implements OnDestroy {

  readonly isLoading = signal(false);
  readonly competition = signal<CompetitionResponse | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly competitionService = inject(CompetitionService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.loadCompetitionDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCompetitionDetails() {
    const competitionId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_COMPETITION_ID)));
    this.isLoading.set(true);
    if (isDefined(competitionId)) {
      this.resolveCompetition(Number(competitionId));
    } else {
      // TODO show error content
      this.isLoading.set(false);
      console.error(`Could not resolve competition ID`);
    }
  }

  private resolveCompetition(competitionId: CompetitionId) {
    this.competitionService.getCompetitionById(competitionId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: competitionResponse => {
        console.log('comp', competitionResponse)
        this.onCompetitionResolved(competitionResponse);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(`Failed to load competition`, err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`competition.failedToLoad`) })
      }
    });
  }

  private onCompetitionResolved(resolvedCompetition: CompetitionResponse) {
    this.competition.set(resolvedCompetition);
  }

}
