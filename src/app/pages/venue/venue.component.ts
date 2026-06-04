import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BasicVenue } from '@src/app/model/venue';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ToastService } from '@src/app/module/toast/service';
import { VenueService } from '@src/app/module/venue/service';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { VenueId } from '@src/app/util/domain-types';
import { parseUrlSlug, PATH_PARAM_VENUE_ID } from '@src/app/util/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-venue',
  imports: [],
  templateUrl: './venue.component.html',
  styleUrl: './venue.component.css'
})
export class VenueComponent implements OnDestroy {

  readonly isLoading = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly venueService = inject(VenueService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.loadVenueDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVenueDetails() {
    const venueId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_VENUE_ID)));
    this.isLoading.set(true);
    if (isDefined(venueId)) {
      this.resolveVenue(Number(venueId));
    } else {
      // TODO show error content
      this.isLoading.set(false);
      console.error(`Could not resolve venue ID`);
    }
  }

  private resolveVenue(venueId: VenueId) {
    this.venueService.getById(venueId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: venueResponse => {
        this.onVenueResolved(venueResponse);
      },
      error: err => {
        console.error(`Failed to load venue`, err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`venue.failedToLoad`) })
      }
    });
  }

  private onVenueResolved(venue: BasicVenue) {
    console.log('got venue', venue);
  }
}
