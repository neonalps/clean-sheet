import { Routes } from '@angular/router';
import { SeasonGamesComponent } from './pages/season-games/season-games.component';
import { GameComponent } from './pages/game/game.component';
import { PATH_PARAM_CLUB_ID, PATH_PARAM_GAME_ID, PATH_PARAM_PERSON_ID, PATH_PARAM_SEASON_ID } from './util/router';
import { PersonComponent } from './pages/person/person.component';
import { ClubComponent } from './pages/club/club.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatComponent } from './pages/chat/chat.component';
import { GameCreateComponent } from './pages/game-create/game-create.component';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [],
    },
    { 
        path: `season/:${PATH_PARAM_SEASON_ID}/games`, 
        component: SeasonGamesComponent,
        canActivate: [],
    },
    { 
        path: `club/:${PATH_PARAM_CLUB_ID}`, 
        component: ClubComponent,
        canActivate: [],
    },
    { 
        path: `game/:${PATH_PARAM_GAME_ID}`, 
        component: GameComponent,
        canActivate: [],
    },
    { 
        path: `person/:${PATH_PARAM_PERSON_ID}`, 
        component: PersonComponent,
        canActivate: [],
    },
    { 
        path: `chat`, 
        component: ChatComponent,
        canActivate: [],
    },
    { 
        path: `create-game`, 
        component: GameCreateComponent,
        canActivate: [],
    },
    { 
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
    },
];
