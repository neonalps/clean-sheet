import { computed, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    readonly active = computed(() => this.open());

    private readonly open = signal(false);

    toggle() {
      this.open.update(current => !current);
    }

    close() {
      this.open.set(false);
    }

}