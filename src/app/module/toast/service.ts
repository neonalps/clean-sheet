import { Injectable } from "@angular/core";
import { ToastId } from "@src/app/util/domain-types";
import { OmitStrict } from "@src/app/util/types";
import { BehaviorSubject, Observable } from "rxjs";

export type ToastType = 'success' | 'error' | 'warn' | 'info';

export interface Toast {
    id: string;
    icon?: string;
    text: string;
    type: ToastType;
    additionalClasses?: string[];
    durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    // the time the toast item is fading plus a few milliseconds grace - after this has elapsed the toast will be removed from the UI
    private static readonly ITEM_FADE_TIME_MS = 800;

    private readonly toasts: Toast[] = [];
    private readonly toasts$ = new BehaviorSubject<Toast[]>([]);

    getToastsObservable(): Observable<Toast[]> {
        return this.toasts$.asObservable();
    }

    addToast(createToast: OmitStrict<Toast, 'id'>) {
        const id = crypto.randomUUID();
        this.toasts.push({
            ...createToast,
            id,
        });
        this.publish();

        setTimeout(() => this.removeById(id), createToast.durationMs + ToastService.ITEM_FADE_TIME_MS);
    }

    private publish() {
        this.toasts$.next(this.toasts);
    }

    private removeById(id: ToastId) {
        this.toasts.splice(this.toasts.findIndex(item => item.id === id), 1);
        this.publish();
    }

}