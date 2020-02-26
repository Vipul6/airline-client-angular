import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlightComponent } from "./flight.component";
import { CheckInComponent } from "./check-in/check-in.component";
import { InFlightComponent } from "./in-flight/in-flight.component";
import { ManagePassengersComponent } from "./manage-passengers/manage-passengers.component";
import { ManageServicesComponent } from "./manage-services/manage-services.component";

const routes: Routes = [
  {
    path: "",
    component: FlightComponent
  },
  {
    path: ":flightId/check-in",
    component: CheckInComponent
  },
  {
    path: ":flightId/in-flight",
    component: InFlightComponent
  },
  {
    path: ":flightId/manage-passengers",
    component: ManagePassengersComponent
  },
  {
    path: ":flightId/manage-services",
    component: ManageServicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule {}
