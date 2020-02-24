import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlightComponent } from "./flight.component";
import { CheckInComponent } from "./check-in/check-in.component";
import { InFlightComponent } from "./in-flight/in-flight.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule {}
