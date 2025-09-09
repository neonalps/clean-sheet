import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "@src/app/module/auth/service";
import { MinuteFormat } from "@src/app/model/account";
import { filter } from "rxjs";
import { isDefined } from "@src/app/util/common";
import { transformGameMinute } from "./util";

@Injectable({
    providedIn: 'root'
})
export class GameMinuteFormatter {

    private readonly minuteFormat = signal<MinuteFormat>(MinuteFormat.Apostrophe);

    private readonly authService = inject(AuthService);

    constructor() {
        this.authService.profileSettings$.pipe(filter(value => isDefined(value))).subscribe(value => {
            // TODO implement
        });
    }

    getCurrentMinuteFormat(): string {
        return this.minuteFormat() === MinuteFormat.Apostrophe ? "'" : '.';
    }

    format(minute: string) {
        return transformGameMinute(minute, this.getCurrentMinuteFormat());
    }

}