import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngxs/store";
import { SetFlight } from "./+state/flight.action";
import { FlightState } from "./+state/flight.state";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlightService } from "./service/flight.service";

@Component({
  selector: "app-flight",
  templateUrl: "./flight.component.html",
  styleUrls: ["./flight.component.scss"]
})
export class FlightComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private router: Router,
    private flightService: FlightService
  ) {}

  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    this.store.dispatch(new SetFlight());
    this.serviceCall();

    // console.log(this.store.selectSnapshot(FlightState.GetFlightLists));
  }

  serviceCall(): void {
    this.flightService
      .getFlights()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        console.log(res);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
