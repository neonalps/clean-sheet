import { Routes } from '@angular/router';
import { SeasonGamesComponent } from './pages/season-games/season-games.component';
import { GameComponent } from './pages/game/game.component';
import { PATH_PARAM_CLUB_ID, PATH_PARAM_GAME_ID, PATH_PARAM_OAUTH_PROVIDER, PATH_PARAM_PERSON_ID, PATH_PARAM_SEASON_ID, PATH_PARAM_VENUE_ID } from './util/router';
import { PersonComponent } from './pages/person/person.component';
import { ClubComponent } from './pages/club/club.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatComponent } from './pages/chat/chat.component';
import { GameCreateComponent } from './pages/game-create/game-create.component';
import { LoginComponent } from './pages/login/login.component';
import { OAuthHandlerComponent } from './component/oauth-handler/oauth-handler.component';
import { LogoutComponent } from './component/logout/logout.component';
import { loggedInGuard, roleGuard } from './module/auth/auth.guard';
import { UserListComponent } from './pages/user-list/user-list.component';
import { VenueComponent } from './pages/venue/venue.component';
import { ModifyGameComponent } from './pages/game-modify/game-modify.component';
import { AccountRole } from './model/auth';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent,
    },
    { 
        path: 'logout', 
        component: LogoutComponent,
    },
    { 
        path: `oauth/:${PATH_PARAM_OAUTH_PROVIDER}`, 
        component: OAuthHandlerComponent,
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `season/:${PATH_PARAM_SEASON_ID}/games`, 
        component: SeasonGamesComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `club/:${PATH_PARAM_CLUB_ID}`, 
        component: ClubComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `game/:${PATH_PARAM_GAME_ID}`, 
        component: GameComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `person/:${PATH_PARAM_PERSON_ID}`, 
        component: PersonComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `venue/:${PATH_PARAM_VENUE_ID}`, 
        component: VenueComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `chat`, 
        component: ChatComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `game/:${PATH_PARAM_GAME_ID}/edit`, 
        component: ModifyGameComponent,
        canActivate: [roleGuard],
        data: {
            role: AccountRole.Manager,
        }
    },
    { 
        path: `create-game`, 
        component: GameCreateComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `user-list`, 
        component: UserListComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: 'settings', 
        component: SettingsComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
    },
];
