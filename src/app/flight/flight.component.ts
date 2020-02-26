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
  private unsubscribe$ = new Subject();
  flightList: Flight[] = [];
  showSpinner: boolean;
  role: string;

  constructor(
    private store: Store,
    private router: Router,
    private flightService: FlightService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.udpateRole();
    this.flightList = this.store.selectSnapshot(FlightState.GetFlightLists);
    if (!this.flightList.length) {
      this.serviceCall();
    }
  }

  udpateRole(): void {
    this.role = "admin";
  }

  serviceCall(): void {
    this.showSpinner = true;
    this.flightService
      .getFlights()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new SetFlight(res));
          this.flightList = res;
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
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

  handleNavigation(flightId: number, dest: string): void {
    this.router.navigate([`flights/${flightId}/${dest}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
