import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.prod";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FlightService {
  constructor(private httpClient: HttpClient) {}

  BASE_URL = environment.apiUrl;

  getFlights(): Observable<any> {
    return this.httpClient.get<any>(`${this.BASE_URL}/flights`);
  }
}
