import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(message: string, status: string): void {
    this.snackBar.open(message, "", {
      duration: 3000,
      panelClass: [status],
      verticalPosition: "top",
      horizontalPosition: "right"
    });
  }
}
