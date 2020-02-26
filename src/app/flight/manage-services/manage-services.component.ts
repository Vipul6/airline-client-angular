import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { FlightState } from "../+state/flight.state";
import { Observable, Subject } from "rxjs";
import { Flight } from "../service/flight.model";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FlightService } from "../service/flight.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { UpdateFlight } from "../+state/flight.action";

@Component({
  selector: "app-manage-services",
  templateUrl: "./manage-services.component.html",
  styleUrls: ["./manage-services.component.scss"]
})
export class ManageServicesComponent implements OnInit, OnDestroy {
  @ViewChild("deleteServiceTemplate") deleteServiceTemplate;
  @ViewChild("updateServiceTemplate") updateServiceTemplate;
  @ViewChild("addServiceTemplate") addServiceTemplate;

  @Select(FlightState.GetFlightLists) flights$: Observable<Flight[]>;

  flightList: Flight[] = [];
  flightId: number;
  flightIndex: number;
  serviceForm: FormGroup;
  deletePayload = {
    serviceName: null,
    itemName: null
  };
  initialValue: string;

  private unsubscribe$ = new Subject();
  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private flightService: FlightService,
    private snacbarService: SnackbarService,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeFlightData();
  }

  initializeFlightData(): void {
    this.flightId = parseInt(this.route.snapshot.params.flightId, 10);
    this.flights$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.flightList = res;
    });
    this.setFlightIndex();
  }

  setFlightIndex(): void {
    const index = this.flightList.findIndex(
      flight => flight.id === this.flightId
    );

    if (index > -1) {
      this.flightIndex = index;
    }
  }

  openUpdateDialog(serviceName: string, itemName: string): void {
    this.initializeServiceForm(serviceName, itemName);
    this.matDialog.open(this.updateServiceTemplate, {
      disableClose: true
    });
  }

  openAddDialog(serviceName: string): void {
    this.initializeServiceForm(serviceName, "");
    this.matDialog.open(this.addServiceTemplate, {
      disableClose: true
    });
  }

  updateService(): void {
    const currentFlight = JSON.parse(
      JSON.stringify(this.flightList[this.flightIndex])
    );

    const serviceName = this.serviceForm.value.key;
    const itemName = this.serviceForm.value.detail;

    const idx = currentFlight[serviceName].indexOf(this.initialValue);
    if (idx > -1) {
      currentFlight[serviceName][idx] = itemName;
    }

    currentFlight.passengersDetail.forEach(passenger => {
      const index = passenger[serviceName].indexOf(this.initialValue);
      if (index > -1) {
        passenger[serviceName][index] = itemName;
      }
    });
    this.performServiceCall(currentFlight, "Service updated successfully.");
  }

  addService(): void {
    const currentFlight = JSON.parse(
      JSON.stringify(this.flightList[this.flightIndex])
    );

    const serviceName = this.serviceForm.value.key;
    const itemName = this.serviceForm.value.detail;

    currentFlight[serviceName].push(itemName);
    this.performServiceCall(currentFlight, "Service updated successfully.");
  }

  openDeleteDialog(serviceName: string, itemName: string): void {
    this.matDialog.open(this.deleteServiceTemplate, {
      disableClose: true
    });

    this.deletePayload.serviceName = serviceName;
    this.deletePayload.itemName = itemName;
  }

  deleteService(): void {
    const currentFlight = JSON.parse(
      JSON.stringify(this.flightList[this.flightIndex])
    );

    const serviceName = this.deletePayload.serviceName;
    const itemName = this.deletePayload.itemName;
    const itemIndex = currentFlight[serviceName].findIndex(
      item => item === itemName
    );
    currentFlight[serviceName].splice(itemIndex, 1);

    currentFlight.passengersDetail.forEach(passenger => {
      const index = passenger[serviceName].findIndex(
        service => service === itemName
      );
      if (index > -1) {
        passenger[serviceName].splice(index, 1);
      }
    });
    this.performServiceCall(currentFlight, "Service removed successfully.");
  }

  performServiceCall(currentFlight: Flight, msg: string): void {
    this.flightService
      .updateFlight(this.flightId, currentFlight)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.store.dispatch(new UpdateFlight(this.flightId, res));
          this.snacbarService.openSnackBar(msg, "success-status");
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

  closeDialog(): void {
    this.matDialog.closeAll();
  }

  initializeServiceForm(key: string, detail: string): void {
    this.initialValue = detail;
    this.serviceForm = this.fb.group({
      key: [key],
      detail: [detail]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
