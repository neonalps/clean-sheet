import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "@src/app/module/auth/service";
import { ScoreFormat } from "@src/app/model/account";
import { filter } from "rxjs";
import { isDefined, isNotDefined } from "@src/app/util/common";
import { ScoreTuple } from "@src/app/model/game";

@Injectable({
    providedIn: 'root'
})
export class ScoreFormatter {

    private readonly scoreFormat = signal<ScoreFormat>(ScoreFormat.Colon);

    private readonly authService = inject(AuthService);

    constructor() {
        this.authService.profileSettings$.pipe(filter(value => isDefined(value))).subscribe(value => {
            console.log('setting score format to', value.scoreFormat);
            this.scoreFormat.set(value.scoreFormat);
        });
    }

    format(score?: ScoreTuple | null) {
        if (isNotDefined(score)) {
            return "-";
        }

        return score.join(this.scoreFormat() === ScoreFormat.Colon ? ':': '-');
    }

}