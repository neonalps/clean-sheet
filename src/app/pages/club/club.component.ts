import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClubResolver } from '@src/app/module/club/resolver';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { ClubId } from '@src/app/util/domain-types';
import { navigateToGameWithoutDetails, parseUrlSlug, PATH_PARAM_CLUB_ID } from '@src/app/util/router';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { ClubService, GetClubByIdResponse } from '@src/app/module/club/service';
import { ExternalLinksComponent } from '@src/app/component/external-links/external-links.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BasicGame } from '@src/app/model/game';
import { BasicClub, SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { FilterableGameListComponent } from '@src/app/component/filterable-game-list/filterable-game-list.component';
import { VenueDetailsComponent } from "@src/app/component/venue-details/venue-details.component";
import { NationalitiesComponent } from '@src/app/component/nationalities/nationalities.component';
import { Nullish } from '@src/app/util/types';
import { ContextMenuComponent, ContextMenuSection } from '@src/app/component/context-menu/context-menu.component';
import { AuthService } from '@src/app/module/auth/service';
import { AccountRole } from '@src/app/model/auth';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { FilePickerService } from '@src/app/module/file-picker/service';
import { ToastService } from '@src/app/module/toast/service';
import { ModalService } from '@src/app/module/modal/service';
import { ModifyClubConfirmPayload } from '@src/app/component/modal-modify-club/modal-modify-club.component';

@Component({
  selector: 'app-club',
  imports: [UiIconComponent, ExternalLinksComponent, I18nPipe, FilterableGameListComponent, VenueDetailsComponent, NationalitiesComponent, ContextMenuComponent],
  templateUrl: './club.component.html'
})
export class ClubComponent implements OnDestroy {

  private static readonly CONTEXT_MENU_KEY_CLUB_EDIT = "editClub";
  private static readonly CONTEXT_MENU_KEY_CLUB_UPLOAD_AVATAR = "uploadClubAvatar";
  private static readonly CONTEXT_MENU_KEY_CLUB_REMOVE_AVATAR = "removeClubAvatar";

  readonly clubResponse = signal<GetClubByIdResponse | null>(null);
  readonly competitionFiltersVisible = signal(false);
  readonly homeAwayFiltersVisible = signal(false);
  readonly isLoading = signal(true);
  readonly mainClub = signal<SmallClub>(environment.mainClub);
  readonly gamesAgainstClub = signal<BasicGame[]>([]);
  readonly contextMenuAvailable = signal(false);
  
  readonly clubContextMenuOptions = computed<ContextMenuSection[]>(() => {
    if (!this.contextMenuAvailable()) {
      return [];
    }

    const club = this.clubResponse();
    if (!club?.club) {
      return [];
    }

    return [
      {
        items: [
          { 
            id: ClubComponent.CONTEXT_MENU_KEY_CLUB_EDIT, 
            text: this.translationService.translate('menu.editClub'), 
            iconDescriptor: { 'type': 'standard', 'content': 'pen' }
          },
          { 
            id: ClubComponent.CONTEXT_MENU_KEY_CLUB_UPLOAD_AVATAR, 
            text: this.translationService.translate('menu.uploadPicture'), 
            iconDescriptor: { 'type': 'standard', 'content': 'upload' }
          },
          { 
            id: ClubComponent.CONTEXT_MENU_KEY_CLUB_REMOVE_AVATAR, 
            text: this.translationService.translate('menu.removePicture'), 
            iconDescriptor: { 'type': 'standard', 'content': 'delete' },
            isDisabled: !club.club.iconSmall,
          },
        ],
      }
    ]
  });

  readonly contextMenuVisible = computed(() => this.clubContextMenuOptions().length > 0);
  readonly iconUrl = computed(() => this.clubResponse()?.club.iconSmall );
  readonly externalLinks = computed(() => {
    const links = this.clubResponse()?.externalLinks;
    return links ? [...links].filter(item => item.provider === 'sofascore') : [];
  });
  readonly nationalities = computed<Nullish<string[]>>(() => {
    const clubValue = this.clubResponse()?.club;
    return isDefined(clubValue) ? [clubValue.countryCode] : [];
  });
  readonly shouldDisplayGames = computed(() => this.clubResponse()?.club.id !== this.mainClub().id);

  private readonly authService = inject(AuthService);
  private readonly clubResolver = inject(ClubResolver);
  private readonly clubService = inject(ClubService);
  private readonly filePicker = inject(FilePickerService);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.authService.authIdentity$
      .pipe(takeUntil(this.destroy$))
      .subscribe(identity => this.contextMenuAvailable.set(identity !== null && identity.role === AccountRole.Manager));

    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.loadClubDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClubResolved(clubResponse: GetClubByIdResponse): void {
    this.clubResponse.set(clubResponse);

    if (clubResponse.allGames) {
      this.gamesAgainstClub.set(clubResponse.allGames.map(game => ({ ...game, opponent: clubResponse.club })));
    }

    this.isLoading.set(false);
  }

  onClubContextMenuItemSelected(itemId: string) {
    const currentClub = ensureNotNullish(this.clubResponse()?.club);

    if (itemId === ClubComponent.CONTEXT_MENU_KEY_CLUB_EDIT) {;
      this.handleModifyClub(currentClub);
    } else if (itemId === ClubComponent.CONTEXT_MENU_KEY_CLUB_UPLOAD_AVATAR) {
      this.handleUploadClubAvatar(currentClub.id);
    } else if (itemId === ClubComponent.CONTEXT_MENU_KEY_CLUB_REMOVE_AVATAR) {
      this.handleRemoveClubAvatar(currentClub.id);
    }
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  private loadClubDetails() {
    const clubId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_CLUB_ID)));
    this.isLoading.set(true);
    if (isDefined(clubId)) {
      this.resolveClub(Number(clubId));
    } else {
      // TODO show error content
      this.isLoading.set(false);
      console.error(`Could not resolve club ID`);
    }
  }

  private resolveClub(clubId: ClubId) {
    this.clubResolver.getById(clubId, undefined, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: clubResponse => {
        this.onClubResolved(clubResponse);
      },
      error: err => {
        // TODO show error
        this.isLoading.set(false);
        console.error(`Could not resolve club`, err);
      }
    });
  }

  private handleModifyClub(club: BasicClub) {
    this.modalService.showModifyClubModal({
      club,
    }).pipe(
      filter(event => event.type === 'confirm'),
      map(event => ensureNotNullish(event.value) as ModifyClubConfirmPayload),
      takeUntil(this.destroy$),
    ).subscribe({
      next: payload => {
        this.clubResponse.update(current => {
          // optimistic UI update
          const currentClubResponse = ensureNotNullish(current);
          return {
            ...currentClubResponse,
            club: {
              ...currentClubResponse.club,
              name: payload.name,
              shortName: payload.shortName,
              countryCode: payload.countryCode,
              city: payload.city,
            },
          };
        });

        // API update
        this.clubService.updateById(club.id, {
          name: payload.name,
          shortName: payload.shortName,
          countryCode: payload.countryCode,
          city: payload.city,
          homeVenueFlavorId: payload.homeVenueFlavorId,
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.toastService.addToast({
              type: 'success',
              text: this.translationService.translate('clubUpdate.success'),
            });
          },
          error: err => {
            console.error(err);
            this.toastService.addToast({
              type: 'error',
              text: this.translationService.translate('clubUpdate.failure'),
            });
          }
        })
      },
    })
  }

  private handleUploadClubAvatar(clubId: ClubId) {
      this.filePicker.pick({ accept: '.jpg,.png,.webp' }).pipe(
        switchMap(([file]) => this.clubService.uploadAvatarFile(clubId, file)),
        takeUntil(this.destroy$),
      ).subscribe({
        next: updatedClub => {
            this.clubResponse.update(current => {
              const currentClubResponse = ensureNotNullish(current);
              return {
                ...currentClubResponse,
                club: updatedClub,
              };
            });
  
            this.toastService.addToast({ type: 'success', text: this.translationService.translate('clubUpdate.success') });
        },
        error: err => {
          console.error(err);
          this.toastService.addToast({ type: 'error', text: this.translationService.translate('clubUpdate.failure') });
        },
      });
    }
  
    private handleRemoveClubAvatar(clubId: ClubId) {
      this.modalService.showDeleteModal({
        titleTextKey: 'action.removeClubAvatar.question',
        contentTextKey: 'action.delete.consequence',
      }).pipe(
        filter(event => event.type === 'confirm'),
        switchMap(() => this.clubService.removeAvatar(clubId)),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.clubResponse.update(current => {
            const currentClubResponse = ensureNotNullish(current);
            return {
              ...currentClubResponse,
              club: {
                ...currentClubResponse.club,
                avatar: undefined
              },
            };
          });
  
          this.toastService.addToast({ type: 'success', text: this.translationService.translate('clubUpdate.success') });
        },
        error: err => {
          console.error(err);
          this.toastService.addToast({ type: 'error', text: this.translationService.translate('clubUpdate.failure') });
        }
      });
    }

}
