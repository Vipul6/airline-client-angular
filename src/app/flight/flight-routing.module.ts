import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlightComponent } from "./flight.component";
import { CheckInComponent } from "./check-in/check-in.component";
import { InFlightComponent } from "./in-flight/in-flight.component";
import { ManagePassengersComponent } from "./manage-passengers/manage-passengers.component";
import { ManageServicesComponent } from "./manage-services/manage-services.component";
import { AuthGuard } from "../core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: FlightComponent
  },
  {
    path: ":flightId/check-in",
    component: CheckInComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ":flightId/in-flight",
    component: InFlightComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ":flightId/manage-passengers",
    component: ManagePassengersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ":flightId/manage-services",
    component: ManageServicesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule {}
