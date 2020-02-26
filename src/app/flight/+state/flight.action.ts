import { Flight } from "../service/flight.model";
export class SetFlight {
  static readonly type = "[FlightState] SetFlight";
  constructor(public payload: Flight[]) {}
}

export class UpdateFlight {
  static readonly type = "[FlightState] UpdateFlight";
  constructor(public flightId: number, public payload: Flight) {}
}
