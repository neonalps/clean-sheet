import { inject, Injectable } from "@angular/core";
import { LocalStorageStorageProvider } from "@src/app/module/storage/local-storage";
import { ToastService, ToastType } from "@src/app/module/toast/service";
import { isNotDefined } from "@src/app/util/common";
import { getCurrentUnix } from "@src/app/util/date";
import { TranslationService } from "@src/app/module/i18n/translation.service";

export type AppLoadEntry = {
    validUntilUnix: number;
    toast?: {
        type: ToastType;
        i18nKey: string;
    };
    scrollPosition?: {
        x: number;
        y: number;
    };
}

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {

    private static readonly LOCAL_STORAGE_KEY_APP_LOAD = `app.load`;

    private readonly localStorageService = inject(LocalStorageStorageProvider);
    private readonly toastService = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    createEntry(entry: AppLoadEntry) {
        this.localStorageService.set(AppLoadService.LOCAL_STORAGE_KEY_APP_LOAD, entry);
    }

    processEntry() {
        const existingEntry = this.localStorageService.get<AppLoadEntry>(AppLoadService.LOCAL_STORAGE_KEY_APP_LOAD);
        if (isNotDefined(existingEntry)) {
            return;
        }

        if (existingEntry.validUntilUnix >= getCurrentUnix()) {
            if (existingEntry.scrollPosition) {
                window.scrollTo(existingEntry.scrollPosition.x, existingEntry.scrollPosition.y);
            }

            if (existingEntry.toast) {
                this.toastService.addToast({ type: existingEntry.toast.type, text: this.translationService.translate(existingEntry.toast.i18nKey) });
            }
        }

        this.localStorageService.remove(AppLoadService.LOCAL_STORAGE_KEY_APP_LOAD);
    }

}