import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UuidSource {

    createUuid() {
        return crypto.randomUUID();
    }

}