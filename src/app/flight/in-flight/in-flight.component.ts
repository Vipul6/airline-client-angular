import { Component, OnInit, ViewChild } from "@angular/core";
import { Flight, SeatDetail, PassengerDetail } from "../service/flight.model";
import { Subject } from "rxjs/internal/Subject";
import { Store, Select } from "@ngxs/store";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { FlightState } from "../+state/flight.state";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { MatDialog } from "@angular/material/dialog";
import { FlightService } from "../service/flight.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { UpdateFlight } from "../+state/flight.action";

@Component({
  selector: "app-in-flight",
  templateUrl: "./in-flight.component.html",
  styleUrls: ["./in-flight.component.scss"]
})
export class InFlightComponent implements OnInit {
  @Select(FlightState.GetFlightLists) flights$: Observable<Flight[]>;
  @ViewChild("servicesModal") servicesModal;
  flightDetails: Flight[] = [];
  flightId: number;
  seatsDetails: SeatDetail[] = [];
  passengersDetailsList: PassengerDetail[] = [];
  private unsubscribe$ = new Subject();
  servicesForm: FormGroup;
  passengerDetails: PassengerDetail = null;
  submit = false;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private flightService: FlightService,
    private snacbarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.flightId = parseInt(this.route.snapshot.params["flightId"], 10);
    this.flights$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.flightDetails = res;
      this.flightDetails = this.flightDetails.filter(
        item => item["id"] === this.flightId
      );
      this.seatsDetails = this.flightDetails[0].seatsDetail;
      this.passengersDetailsList = this.flightDetails[0].passengersDetail;
    });
  }

  openDialog(id: string): void {
    this.passengerDetails = JSON.parse(
      JSON.stringify(
        this.passengersDetailsList.filter(item => item.seatNumber === id)[0]
      )
    );
    this.servicesForm = this.fb.group({
      ancilliaryServices: [this.passengerDetails.ancilliaryServices],
      shoppingItems: [this.passengerDetails.shoppingItems],
      meals: [this.passengerDetails.meals]
    });

    this.submit = false;
    this.dialog.open(this.servicesModal);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onchange(): void {
    if (
      this.isChanged("ancilliaryServices") ||
      this.isChanged("shoppingItems") ||
      this.isChanged("meals")
    ) {
      this.submit = true;
    } else {
      this.submit = false;
    }
  }

  isChanged(type: string): boolean {
    let returnValue = false;

    if (
      JSON.stringify(this.servicesForm.value[type].sort()) !==
      JSON.stringify(this.passengerDetails[type].sort())
    ) {
      returnValue = true;
    }
    return returnValue;
  }

  onSubmit(): void {
    const flightList = JSON.parse(JSON.stringify(this.flightDetails));
    const passengerIndex = this.passengersDetailsList.findIndex(item => {
      return item.id === this.passengerDetails.id;
    });

    flightList[0].passengersDetail[
      passengerIndex
    ].ancilliaryServices = this.servicesForm.controls.ancilliaryServices.value;
    flightList[0].passengersDetail[
      passengerIndex
    ].shoppingItems = this.servicesForm.controls.shoppingItems.value;
    flightList[0].passengersDetail[
      passengerIndex
    ].meals = this.servicesForm.controls.meals.value;

    this.flightService
      .updateFlight(this.flightId, flightList[0])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new UpdateFlight(this.flightId, flightList[0]));
          this.snacbarService.openSnackBar(
            "Services updated.",
            "success-status"
          );
          this.closeDialog();
        },
        error => {
          console.log(error);
          this.snacbarService.openSnackBar(
            "Something went wrong please try again after some time.",
            "failure-status"
          );
        }
      );
  }
}
