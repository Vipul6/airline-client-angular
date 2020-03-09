import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Flight } from "../service/flight.model";
import { Select, Store } from "@ngxs/store";
import { FlightState } from "../+state/flight.state";
import { Observable, Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { FlightService } from "../service/flight.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { UpdateFlight } from "../+state/flight.action";

@Component({
  selector: "app-manage-passengers",
  templateUrl: "./manage-passengers.component.html",
  styleUrls: ["./manage-passengers.component.scss"]
})
export class ManagePassengersComponent implements OnInit, OnDestroy {
  @ViewChild("addPassenger") addPassengerTemplate;
  @ViewChild("updatePassenger") updatePassengerTemplate;
  @Select(FlightState.GetFlightLists) flights$: Observable<Flight[]>;

  flightList: Flight[] = [];
  flightId: number;
  flightIndex: number;
  filteredFlightData: Flight[] = [];
  filters = {
    passportNumber: false,
    address: false,
    dateOfBirth: false
  };
  updatePassengerIndex: number;
  passengerForm: FormGroup;
  initialView = true;
  userDetailForm: FormGroup;
  private unsubscribe$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private flightService: FlightService,
    private snacbarService: SnackbarService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initializeFlightData();
    this.initializeForm();
  }

  initializeFlightData(): void {
    this.flightId = parseInt(this.route.snapshot.params.flightId, 10);
    this.flights$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.flightList = res;
      this.filteredFlightData = res;
    });
    this.setFlightIndex();
  }

  initializeForm(): void {
    this.passengerForm = this.fb.group({
      id: [],
      name: [],
      dateOfBirth: [],
      seatNumber: [],
      isCheckedIn: ["false"],
      hasInfant: ["false"],
      isWheelChairRequired: ["false"],
      passportNumber: [],
      address: [],
      ancilliaryServices: [[]],
      meals: [[]],
      shoppingItems: [[]]
    });
  }

  setFlightIndex(): void {
    const index = this.flightList.findIndex(
      flight => flight.id === this.flightId
    );

    if (index > -1) {
      this.flightIndex = index;
    }
  }

  updateCheckbox(event: any, key: string): void {
    this.filteredFlightData = JSON.parse(JSON.stringify(this.flightList));
    this.filters[key] = event.checked;
    this.applyFilter();
  }

  applyFilter(): void {
    let filteredPassengers = this.filteredFlightData[this.flightIndex]
      .passengersDetail;
    if (this.filters.address) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "address"
      );
    }

    if (this.filters.passportNumber) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "passportNumber"
      );
    }

    if (this.filters.dateOfBirth) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "dateOfBirth"
      );
    }

    const filteredData = JSON.parse(JSON.stringify(this.flightList));
    filteredData[this.flightIndex].passengersDetail = filteredPassengers;

    this.filteredFlightData = filteredData;
  }

  performFilterOperation(passengersList, filterName) {
    return passengersList.filter(passenger => !passenger[filterName]);
  }

  openDialog(): void {
    this.matDialog.open(this.addPassengerTemplate, {
      disableClose: true
    });
  }

  closeDialog(): void {
    this.matDialog.closeAll();
  }

  handleCheckboxChange(
    event: any,
    serviceName: string,
    itemName: string
  ): void {
    if (event.checked) {
      this.passengerForm.value[serviceName].push(itemName);
    } else {
      const index = this.passengerForm.value[serviceName].findIndex(
        item => item === itemName
      );
      this.passengerForm.value[serviceName].splice(index, 1);
    }
  }

  isSeatsFull(): boolean {
    return this.flightList[this.flightIndex]?.seatsDetail.filter(
      seats => !seats.isOccupied
    ).length
      ? false
      : true;
  }

  handleFormSubmit(): void {
    this.passengerForm.value.id =
      this.flightList[this.flightIndex]?.passengersDetail.length + 1;

    const currentFlight = JSON.parse(
      JSON.stringify(this.flightList[this.flightIndex])
    );
    currentFlight.passengersDetail.push(this.passengerForm.value);

    this.flightService
      .updateFlight(this.flightId, currentFlight)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new UpdateFlight(this.flightId, res));
          this.snacbarService.openSnackBar(
            "New passenger added.",
            "success-status"
          );
          this.matDialog.closeAll();
        },
        error => {
          this.snacbarService.openSnackBar(
            "Something went wrong please try again after some time.",
            "failure-status"
          );
        }
      );
  }

  openUserDialog(passengerIndex: number): void {
    this.updatePassengerIndex = passengerIndex;
    this.matDialog.open(this.updatePassengerTemplate, {
      disableClose: true
    });
  }

  updateUserDetail(key: string): void {
    const value = this.filteredFlightData[this.flightIndex].passengersDetail[
      this.updatePassengerIndex
    ][key];
    this.initializeUserDetailForm(key, value);
    this.initialView = !this.initialView;
  }

  initializeUserDetailForm(key: string, value: string): void {
    this.userDetailForm = this.fb.group({
      key: [key],
      detail: [value]
    });
  }

  handleUserUpdateSubmit(): void {
    const currentFlight = JSON.parse(
      JSON.stringify(this.flightList[this.flightIndex])
    );
    const passengerId = this.filteredFlightData[this.flightIndex]
      .passengersDetail[this.updatePassengerIndex].id;
    const passengerIndex = currentFlight.passengersDetail.findIndex(
      passenger => passenger.id === passengerId
    );
    const key = this.userDetailForm.value.key;
    const value = this.userDetailForm.value.detail;

    currentFlight.passengersDetail[passengerIndex][key] = value;
    this.flightService.updateFlight(this.flightId, currentFlight).subscribe(
      res => {
        this.store.dispatch(new UpdateFlight(this.flightId, res));
        this.snacbarService.openSnackBar(
          "Passenger detail updated.",
          "success-status"
        );
        this.initialView = !this.initialView;
        this.matDialog.closeAll();
      },
      error => {
        this.snacbarService.openSnackBar(
          "Something went wrong please try again after some time.",
          "failure-status"
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
