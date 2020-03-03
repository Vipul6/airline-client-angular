import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FlightService } from "src/app/flight/service/flight.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private flightService: FlightService) {
    const url: string = window.location.href;
    this.activeLink = "";

    if (url.includes("flights")) {
      this.activeLink = "flights";
    } else if (url.includes("about")) {
      this.activeLink = "about";
    }
  }

  activeLink: string;
  isLoggedIn: boolean;
  showRole: boolean;
  role = "staff";

  ngOnInit(): void {
    this.isLoggedIn = !sessionStorage.id ? true : false;
  }

  getImageSrc(): string {
    let returnValue = "";
    if (this.role === "admin") {
      returnValue = `../../../assets/images/admin-icon.png`;
    } else {
      returnValue = `../../../assets/images/staff-icon.png`;
    }
    return returnValue;
  }

  showRoles(): void {
    this.showRole = !this.showRole;
  }

  updateRole(role: string): void {
    this.role = role;
    this.showRole = false;
    this.flightService.role.next(role);
  }

  handleNavigation(location: string): void {
    this.router.navigate([`/${location}`]);
    this.activeLink = location;
  }
}
