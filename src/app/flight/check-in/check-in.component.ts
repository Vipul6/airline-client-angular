import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, Select } from "@ngxs/store";
import { FlightState } from "../+state/flight.state";
import { Flight, SeatDetail, PassengerDetail } from "../service/flight.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FlightService } from "../service/flight.service";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UpdateFlight } from "../+state/flight.action";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.component.html",
  styleUrls: ["./check-in.component.scss"]
})
export class CheckInComponent implements OnInit, OnDestroy {
  @Select(FlightState.GetFlightLists) flights$: Observable<Flight[]>;
  @ViewChild("seatNumberChangeModal") seatNumberChangeModal;
  @ViewChild("checkedInModal") checkedInModal;
  flightDetails: Flight[] = [];
  seatsDetails: SeatDetail[] = [];
  availableSeatsDetails: SeatDetail[] = [];
  passengersDetailsList: PassengerDetail[] = [];
  passengersDetails: PassengerDetail = null;
  openModal = false;
  submit = false;
  seatSelection: FormGroup;
  checkedInform: FormGroup;
  passengerId: number;
  flightId: number;
  private unsubscribe$ = new Subject();

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

  openCloseModal(type?, id?) {
    if (type === "seatChange") {
      if (this.openModal !== true) {
        this.availableSeatsDetails = this.seatsDetails.filter(
          item => item["isOccupied"] !== true
        );
        this.seatSelection = this.fb.group({
          seatNumber: [""]
        });

        this.passengerId = id ? id : null;
      }
    } else if (type === "checkedinModal") {
      if (this.openModal !== true) {
        this.passengersDetails = this.flightDetails[0].passengersDetail.filter(
          item => {
            return item.seatNumber === id;
          }
        )[0];

        this.checkedInform = this.fb.group({
          isCheckedIn: [this.passengersDetails.isCheckedIn.toString()]
        });

        this.passengerId = this.passengersDetails.id;
      }
    }
    this.openModal = this.openModal === true ? false : true;

    if (this.openModal) {
      type === "seatChange"
        ? this.dialog.open(this.seatNumberChangeModal)
        : this.dialog.open(this.checkedInModal);
    } else {
      this.dialog.closeAll();
    }
  }

  onChangeSeatNumber() {
    this.submit =
      this.seatSelection.controls["seatNumber"].value !== "Choose one seat"
        ? true
        : false;
  }

  onChangeCheckedInStatus() {
    this.submit =
      this.passengersDetails.isCheckedIn.toString() ===
      this.checkedInform.controls["isCheckedIn"].value
        ? false
        : true;
  }

  onSubmit() {
    const flightList = JSON.parse(JSON.stringify(this.flightDetails));
    const passengerIndex = this.passengersDetailsList.findIndex(item => {
      return item.id === this.passengerId;
    });
    const prevSeatIndex = this.seatsDetails.findIndex(item => {
      return (
        flightList[0].passengersDetail[passengerIndex].seatNumber &&
        item.number ===
          flightList[0].passengersDetail[passengerIndex].seatNumber
      );
    });

    const newSeatIndex = this.seatsDetails.findIndex(item => {
      return item.number === this.seatSelection.controls["seatNumber"].value;
    });

    if (prevSeatIndex) {
      flightList[0].seatsDetail[prevSeatIndex].isOccupied = false;
      flightList[0].seatsDetail[prevSeatIndex].passengerId = null;
    }

    flightList[0].passengersDetail[
      passengerIndex
    ].seatNumber = this.seatSelection.controls["seatNumber"].value;
    flightList[0].passengersDetail[passengerIndex].isCheckedIn = false;
    flightList[0].seatsDetail[newSeatIndex].isOccupied = true;
    flightList[0].seatsDetail[newSeatIndex].passengerId = this.passengerId;

    this.flightService
      .updateFlight(this.flightId, flightList[0])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new UpdateFlight(this.flightId, flightList[0]));
          this.snacbarService.openSnackBar(
            "Passenger seat number updated.",
            "success-status"
          );
        },
        error => {
          console.log(error);
          this.snacbarService.openSnackBar(
            "Something went wrong please try again after some time.",
            "failure-status"
          );
        }
      );

    this.openCloseModal();
  }

  onCheckedInStatusSubmit() {
    const flightList = JSON.parse(JSON.stringify(this.flightDetails));
    const passengerIndex = this.passengersDetailsList.findIndex(item => {
      return item.id === this.passengerId;
    });
    flightList[0].passengersDetail[passengerIndex].isCheckedIn =
      this.checkedInform.controls["isCheckedIn"].value === "true";

    this.flightService
      .updateFlight(this.flightId, flightList[0])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new UpdateFlight(this.flightId, flightList[0]));
          this.snacbarService.openSnackBar(
            "Passenger check-in status updated.",
            "success-status"
          );
        },
        error => {
          this.snacbarService.openSnackBar(
            "Something went wrong please try again after some time.",
            "failure-status"
          );
          console.log(error);
        }
      );
    this.openCloseModal();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
