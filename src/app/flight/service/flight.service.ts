import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Flight } from "./flight.model";

@Injectable({
  providedIn: "root"
})
export class FlightService {
  constructor(private httpClient: HttpClient) {}

  BASE_URL = environment.apiUrl;

  getFlights(): Observable<Flight[]> {
    return this.httpClient.get<Flight[]>(`${this.BASE_URL}/flights`);
  }

  updateFlight(flightId: number, payload: Flight): Observable<Flight> {
    return this.httpClient.put<Flight>(
      `${this.BASE_URL}/flights/${flightId}`,
      payload
    );
  }
}
