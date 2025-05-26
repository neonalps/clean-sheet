import { Routes } from '@angular/router';
import { SeasonGamesComponent } from './pages/season-games/season-games.component';

export const routes: Routes = [
    { 
        path: 'seasons/:season', 
        component: SeasonGamesComponent,
        canActivate: [],
    },
];
