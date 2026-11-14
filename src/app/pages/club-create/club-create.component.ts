import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: 'app-club-create',
  imports: [],
  templateUrl: './club-create.component.html'
})
export class ClubCreateComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}