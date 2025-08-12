import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    readonly open$ = new BehaviorSubject<boolean>(false);

    toggle() {
      this.open$.next(!this.open$.getValue());
    }

    close() {
      this.open$.next(false);
    }

}