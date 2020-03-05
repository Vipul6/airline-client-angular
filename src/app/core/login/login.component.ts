import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { SetUser } from "../+state/login.action";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (sessionStorage.username) {
      this.router.navigate(["/"]);
    }
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  handleAuthentication(): void {
    sessionStorage.setItem("username", this.loginForm.value.username);
    this.store.dispatch(new SetUser(this.loginForm.value.username));
  }

  handleSubmit(): void {
    if (this.loginForm.valid) {
      if (
        this.loginForm.value.username === environment.credential.username &&
        this.loginForm.value.password === environment.credential.password
      ) {
        this.handleAuthentication();
      } else {
        this.snackbarService.openSnackBar(
          "Invalid username or password !",
          "failure-status"
        );
      }
    }
  }
}
