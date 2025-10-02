import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "@src/app/module/auth/service";
import { GameMinuteFormat } from "@src/app/model/account";
import { filter } from "rxjs";
import { isDefined } from "@src/app/util/common";
import { transformGameMinute } from "./util";

@Injectable({
    providedIn: 'root'
})
export class GameMinuteFormatter {

    private readonly minuteFormat = signal<GameMinuteFormat>(GameMinuteFormat.Apostrophe);

    private readonly authService = inject(AuthService);

    constructor() {
        this.authService.profileSettings$.pipe(filter(value => isDefined(value))).subscribe(value => {
            console.log('setting game minute format to', value.gameMinuteFormat);
            this.minuteFormat.set(value.gameMinuteFormat);
        });
    }

    getCurrentMinuteFormat(): string {
        return this.minuteFormat() === GameMinuteFormat.Apostrophe ? "'" : '.';
    }

    format(minute: string) {
        return transformGameMinute(minute, this.getCurrentMinuteFormat());
    }

}