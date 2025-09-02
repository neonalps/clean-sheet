import { Injectable, signal } from "@angular/core";
import { StatsModalPayload } from "@src/app/component/stats-modal/stats-modal.component";
import { assertUnreachable } from "@src/app/util/common";
import { BehaviorSubject, Observable, Subject } from "rxjs";

interface ModalEvent {
    type: 'cancel' | 'confirm' | 'value';
    value?: unknown;
}

export enum Modal {
    Delete = 'delete',
    Stats = 'stats'
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
    
    readonly active$ = new BehaviorSubject<boolean>(false);
    readonly modalType = signal<Modal | null>(null);

    readonly deleteModalPayload$ = new Subject<void>();
    readonly statsModalPayload$ = new Subject<StatsModalPayload>();

    private modalEvent$?: Subject<ModalEvent>;

    showDeleteModal(payload: void): Observable<ModalEvent> {
        return this.showModal(Modal.Delete, payload);
    }

    showStatsModal(payload: StatsModalPayload): Observable<ModalEvent> {
        return this.showModal(Modal.Stats, payload);
    }

    outsideClicked() {
        this.onModalCancel();
    }

    onCancel() {
        this.onModalCancel();
    }

    onConfirm(confirmValue?: unknown) {
        this.onModalConfirm(confirmValue);
    }

    private closeModal(event: ModalEvent) {
        this.modalEvent$?.next(event);
        this.modalEvent$?.complete();
        this.active$.next(false);

        // delay setting the modal type to null so the transition can be executed
        setTimeout(() => this.modalType.set(null), 400);
    }

    private onModalCancel() {
        this.closeModal({ type: 'cancel' });
    }

    private onModalConfirm(confirmValue?: unknown) {
        const event: ModalEvent = { type: 'confirm'  };

        if (confirmValue) {
            event.value = confirmValue;
        }

        this.closeModal(event);
    }

    private showModal(type: Modal, payload: unknown): Observable<ModalEvent> {
        if (this.active$.value === true) {
            throw new Error(`A modal is already open.`)
        }

        this.modalType.set(type);
        this.active$.next(true);

        // we must delay the publishing because the modal component might not be initialized yet
        setTimeout(() => this.publishPayload(type, payload), 0);

        this.modalEvent$ = new Subject();
        return this.modalEvent$.asObservable();
    }

    private publishPayload(type: Modal, payload: unknown) {
        switch (type) {
            case Modal.Delete:
                this.deleteModalPayload$.next();
                break;
            case Modal.Stats:
                this.statsModalPayload$.next(payload as StatsModalPayload);
                break;
            default:
                assertUnreachable(type);
        }
    }

}