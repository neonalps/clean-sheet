import { Routes } from '@angular/router';
import { SeasonGamesComponent } from './pages/season-games/season-games.component';
import { GameComponent } from './pages/game/game.component';
import { PATH_PARAM_GAME_ID, PATH_PARAM_SEASON_ID } from './util/router';

export const routes: Routes = [
    { 
        path: `season/:${PATH_PARAM_SEASON_ID}/games`, 
        component: SeasonGamesComponent,
        canActivate: [],
    },
    { 
        path: `game/:${PATH_PARAM_GAME_ID}`, 
        component: GameComponent,
        canActivate: [],
    },
];
