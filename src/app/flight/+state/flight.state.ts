import { State, Selector, Action, StateContext } from "@ngxs/store";
import { SetFlight } from "./flight.action";
import { FlightStateModel } from "./flight.model";
import { Injectable } from "@angular/core";
import { Flight } from "../service/flight.model";

const defaultState: FlightStateModel = {
  flightList: []
};

@State<FlightStateModel>({
  name: "FlightState",
  defaults: defaultState
})
@Injectable()
export class FlightState {
  constructor() {}

  @Selector()
  static GetFlightLists(state: FlightStateModel): Flight[] {
    return state.flightList;
  }

  @Action(SetFlight)
  SetFlight(
    { patchState }: StateContext<FlightStateModel>,
    { payload }: SetFlight
  ): void {
    patchState({
      flightList: payload
    });
  }
}
