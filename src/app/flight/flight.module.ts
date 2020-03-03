import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";
import { FlightState } from "./+state/flight.state";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { FlightComponent } from "./flight.component";
import { FlightRoutingModule } from "./flight-routing.module";
import { CheckInComponent } from "./check-in/check-in.component";
import { InFlightComponent } from "./in-flight/in-flight.component";
import { environment } from "src/environments/environment";
import { SharedModule } from "../shared/shared.module";
import { ManagePassengersComponent } from "./manage-passengers/manage-passengers.component";
import { ManageServicesComponent } from "./manage-services/manage-services.component";

@NgModule({
  declarations: [
    FlightComponent,
    CheckInComponent,
    InFlightComponent,
    ManagePassengersComponent,
    ManageServicesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxsModule.forRoot([FlightState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    FlightRoutingModule
  ],
  exports: [FlightComponent]
})
export class FlightModule {}
