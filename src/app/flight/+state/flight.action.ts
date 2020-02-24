import { Flight } from "../service/flight.model";
export class SetFlight {
  static readonly type = "[FlightState] SetFlight";
  constructor(public payload: Flight[]) {}
}
