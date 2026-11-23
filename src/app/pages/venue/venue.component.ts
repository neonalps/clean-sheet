import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VenueDetailsComponent } from '@src/app/component/venue-details/venue-details.component';
import { BasicVenue } from '@src/app/model/venue';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ToastService } from '@src/app/module/toast/service';
import { VenueService } from '@src/app/module/venue/service';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { VenueId } from '@src/app/util/domain-types';
import { navigateToClub, parseUrlSlug, PATH_PARAM_VENUE_ID } from '@src/app/util/router';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { BasicClub } from '@src/app/model/club';
import { ContextMenuSection, ContextMenuComponent } from '@src/app/component/context-menu/context-menu.component';
import { AuthService } from '@src/app/module/auth/service';
import { AccountRole } from '@src/app/model/auth';
import { ModalService } from '@src/app/module/modal/service';
import { ModifyVenueConfirmPayload } from '@src/app/component/modal-modify-venue/modal-modify-venue.component';

@Component({
  selector: 'app-venue',
  imports: [VenueDetailsComponent, LoadingComponent, ContextMenuComponent],
  templateUrl: './venue.component.html'
})
export class VenueComponent implements OnDestroy {

  private static readonly CONTEXT_MENU_KEY_VENUE_DELETE = "deleteVenue";
  private static readonly CONTEXT_MENU_KEY_VENUE_EDIT = "editVenue";

  readonly isLoading = signal(false);
  readonly venue = signal<BasicVenue | null>(null);

  readonly contextMenuAvailable = signal(false);

  readonly venueContextMenuOptions = computed<ContextMenuSection[]>(() => {
    if (!this.contextMenuAvailable()) {
      return [];
    }

    const venue = this.venue();
    if (!venue) {
      return [];
    }

    return [
      {
        items: [
          { 
            id: VenueComponent.CONTEXT_MENU_KEY_VENUE_EDIT, 
            text: this.translationService.translate('menu.editVenue'), 
            iconDescriptor: { 'type': 'standard', 'content': 'pen' }
          },
        ],
      },
      { 
        items: [
          {
            id: VenueComponent.CONTEXT_MENU_KEY_VENUE_DELETE,
            text: this.translationService.translate('menu.deleteVenue'),
            iconDescriptor: { 
              type: 'standard', 
              content: 'delete'
            }, 
            isDanger: true
          },
      ] },
    ]
  });

  readonly contextMenuVisible = computed(() => this.venueContextMenuOptions().length > 0);

  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly venueService = inject(VenueService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.authService.authIdentity$
      .pipe(takeUntil(this.destroy$))
      .subscribe(identity => this.contextMenuAvailable.set(identity !== null && identity.role === AccountRole.Manager));

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

  onClubClicked(club: BasicClub) {
    navigateToClub(this.router, club);
  }

  onVenueContextMenuItemSelected(itemId: string) {
    const currentVenue = ensureNotNullish(this.venue());

    if (itemId === VenueComponent.CONTEXT_MENU_KEY_VENUE_EDIT) {;
      this.handleModifyVenue(currentVenue);
    } else if (itemId === VenueComponent.CONTEXT_MENU_KEY_VENUE_DELETE) {;
      this.handleDeleteVenue(currentVenue.id);
    }
  }

  private handleModifyVenue(venue: BasicVenue): void {
    this.modalService.showModifyVenueModal({
      venue,
    }).pipe(
      filter(event => event.type === 'confirm'),
      map(event => ensureNotNullish(event.value) as ModifyVenueConfirmPayload),
      takeUntil(this.destroy$),
    ).subscribe({
      next: payload => {
        const { id, ...payloadWithoutId } = payload;
        this.venue.update(current => {
          // optimistic UI update
          const currentVenue = ensureNotNullish(current);
          return {
            ...currentVenue,
            ...payloadWithoutId,
          };
        });

        // API update
        this.venueService.updateById(venue.id, {
          name: payload.name,
          shortName: payload.shortName,
          countryCode: payload.countryCode,
          city: payload.city,
          district: payload.district,
          capacity: payload.capacity,
          latitude: payload.latitude,
          longitude: payload.longitude,
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.toastService.addToast({
              type: 'success',
              text: this.translationService.translate('venueUpdate.success'),
            });
          },
          error: err => {
            console.error(err);
            this.toastService.addToast({
              type: 'error',
              text: this.translationService.translate('venueUpdate.failure'),
            });
          }
        })
      },
    });
  }

  private handleDeleteVenue(venueId: VenueId): void {
    this.toastService.addToast({ type: 'warn', text: this.translationService.translate('feature.notImplemented') });
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
    this.venueService.getById(venueId, true).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: venueResponse => {
        this.onVenueResolved(venueResponse);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(`Failed to load venue`, err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`venue.failedToLoad`) })
      }
    });
  }

  private onVenueResolved(resolvedVenue: BasicVenue) {
    this.venue.set(resolvedVenue);
  }
}
