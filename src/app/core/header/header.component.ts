import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {
    const url: string = window.location.href;
    this.activeLink = "";

    if (url.includes("flights")) {
      this.activeLink = "flights";
    } else if (url.includes("about")) {
      this.activeLink = "about";
    }
  }

  activeLink: string;

  ngOnInit(): void {}

  handleNavigation(location: string): void {
    this.router.navigate([`/${location}`]);
    this.activeLink = location;
  }
}
