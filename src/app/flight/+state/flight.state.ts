import { State, Selector, Action, StateContext } from "@ngxs/store";
import { SetFlight } from "./flight.action";
import { FlightStateModel } from "./flight.model";
import { Injectable } from "@angular/core";

const defaultState: FlightStateModel = {
  demo: []
};

@State<FlightStateModel>({
  name: "FlightState",
  defaults: defaultState
})
@Injectable()
export class FlightState {
  constructor() {}

  @Selector()
  static GetFlightLists(state: FlightStateModel): string[] {
    return state.demo;
  }

  @Action(SetFlight)
  SetDate({ getState, patchState }: StateContext<FlightStateModel>): void {
    patchState({
      demo: ["RM", "20"]
    });
  }
}
