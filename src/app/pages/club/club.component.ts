import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BasicClub } from '@src/app/model/club';
import { ClubResolver } from '@src/app/module/club/resolver';
import { isDefined } from '@src/app/util/common';
import { ClubId } from '@src/app/util/domain-types';
import { PATH_PARAM_CLUB_ID } from '@src/app/util/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-club',
  imports: [],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnDestroy {

  club!: BasicClub;
  isLoading = true;

  private readonly clubResolver = inject(ClubResolver);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  constructor() {
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

  onClubResolved(club: BasicClub): void {
      this.club = club;
      this.isLoading = false;

      console.log('club', club);
    }

  private loadClubDetails() {
    const clubId = this.route.snapshot.paramMap.get(PATH_PARAM_CLUB_ID);
    this.isLoading = true;
    if (isDefined(clubId)) {
      this.resolveClub(Number(clubId));
    } else {
      // TODO show error content
      this.isLoading = false;
      console.error(`Could not resolve club ID`);
    }
  }

  private resolveClub(clubId: ClubId) {
    this.clubResolver.getById(clubId, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: club => {
        this.onClubResolved(club);
      },
      error: err => {
        // TODO show error
        this.isLoading = false;
        console.error(`Could not resolve club`, err);
      }
    });
  }

}
