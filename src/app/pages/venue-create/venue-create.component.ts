import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: 'app-venue-create',
  imports: [],
  templateUrl: './venue-create.component.html'
})
export class VenueCreateComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}