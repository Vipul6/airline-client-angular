import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngxs/store";
import { SetFlight } from "./+state/flight.action";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlightService } from "./service/flight.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { Flight } from "./service/flight.model";
import { FlightState } from "./+state/flight.state";

@Component({
  selector: "app-flight",
  templateUrl: "./flight.component.html",
  styleUrls: ["./flight.component.scss"]
})
export class FlightComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private router: Router,
    private flightService: FlightService,
    private snackbarService: SnackbarService
  ) {}

  private unsubscribe$ = new Subject();
  flightList: Flight[] = [];

  ngOnInit(): void {
    this.flightList = this.store.selectSnapshot(FlightState.GetFlightLists);
    if (!this.flightList.length) {
      this.serviceCall();
    }
  }

  serviceCall(): void {
    this.flightService
      .getFlights()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new SetFlight(res));
          this.flightList = res;
        },
        error => {
          this.snackbarService.openSnackBar(
            "Something went wrong please try again after some time.",
            "failure-status"
          );
        }
      );
  }

  getImageSource(flightName: string): string {
    return `../../assets/images/${flightName}.png`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
