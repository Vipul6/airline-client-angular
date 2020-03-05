import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlightService } from "src/app/flight/service/flight.service";
import { Select, Store } from "@ngxs/store";
import { LoginState } from "../+state/login.state";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SetUser } from "../+state/login.action";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeLink: string;
  isLoggedIn: boolean;
  showRole: boolean;
  role = "staff";

  private unsubscribe$ = new Subject();
  @Select(LoginState.GetUser) user$: Observable<string>;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private store: Store
  ) {
    const url: string = window.location.href;
    this.activeLink = "";

    if (url.includes("flights")) {
      this.activeLink = "flights";
    } else if (url.includes("about")) {
      this.activeLink = "about";
    } else if (url.includes("login")) {
      this.activeLink = "login";
    }
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.isLoggedIn = true;
        this.router.navigate(["/"]);
        this.activeLink = "";
      } else {
        this.isLoggedIn = false;
      }
    });

    if (sessionStorage.username && !this.isLoggedIn) {
      this.store.dispatch(new SetUser(sessionStorage.username));
    }
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

  login(): void {
    this.router.navigate([`/login`]);
    this.activeLink = "login";
  }

  logout(): void {
    sessionStorage.clear();
    this.showRole = false;
    this.store.dispatch(new SetUser(null));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
