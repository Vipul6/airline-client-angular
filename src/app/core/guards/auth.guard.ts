import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { SnackbarService } from "../../shared/services/snackbar.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isLoggedIn = sessionStorage.username ? true : false;
    if (!isLoggedIn) {
      this.snackBarService.openSnackBar(
        "Please login first.",
        "failure-status"
      );
    }
    return isLoggedIn;
  }
}
