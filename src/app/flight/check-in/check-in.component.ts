import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { FlightState } from "../+state/flight.state";
import { Flight, SeatDetail, PassengerDetail } from "../service/flight.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.component.html",
  styleUrls: ["./check-in.component.scss"]
})
export class CheckInComponent implements OnInit, OnDestroy {
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

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const flightList = this.store.selectSnapshot(FlightState.GetFlightLists);
    this.flightId = parseInt(this.route.snapshot.params["flightId"], 10);
    this.flightDetails = flightList.filter(
      item => item["id"] === this.flightId
    );
    this.seatsDetails = this.flightDetails[0].seatsDetail;
    this.passengersDetailsList = this.flightDetails[0].passengersDetail;
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
    console.log("===>Submit");

    const flightList = JSON.parse(JSON.stringify(this.flightDetails));
    const flightIndex = this.flightDetails.findIndex(item => {
      return item.id === this.flightId;
    });
    const passengerIndex = this.passengersDetailsList.findIndex(item => {
      return item.id === this.passengerId;
    });
    const prevSeatIndex = this.seatsDetails.findIndex(item => {
      return (
        flightList[flightIndex].passengersDetail[passengerIndex].seatNumber &&
        item.number ===
          flightList[flightIndex].passengersDetail[passengerIndex].seatNumber
      );
    });

    const newSeatIndex = this.seatsDetails.findIndex(item => {
      return item.number === this.seatSelection.controls["seatNumber"].value;
    });

    if (prevSeatIndex) {
      flightList[flightIndex].seatsDetail[prevSeatIndex].isOccupied = false;
      flightList[flightIndex].seatsDetail[prevSeatIndex].passengerId = null;
    }

    flightList[flightIndex].passengersDetail[
      passengerIndex
    ].seatNumber = this.seatSelection.controls["seatNumber"].value;
    flightList[flightIndex].passengersDetail[
      passengerIndex
    ].isCheckedIn = false;
    flightList[flightIndex].seatsDetail[newSeatIndex].isOccupied = true;
    flightList[flightIndex].seatsDetail[
      newSeatIndex
    ].passengerId = this.passengerId;

    this.openCloseModal();
  }

  onCheckedInStatusSubmit() {
    const flightList = JSON.parse(JSON.stringify(this.flightDetails));
    const flightIndex = this.flightDetails.findIndex(item => {
      return item.id === this.flightId;
    });
    const passengerIndex = this.passengersDetailsList.findIndex(item => {
      return item.id === this.passengerId;
    });
    flightList[flightIndex].passengersDetail[passengerIndex].isCheckedIn =
      this.checkedInform.controls["isCheckedIn"].value === "true";

    console.log(flightList);
    this.openCloseModal();
  }

  ngOnDestroy(): void {}
}
