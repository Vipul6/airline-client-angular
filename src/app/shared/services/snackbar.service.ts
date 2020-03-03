import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(message: string, status: string): void {
    const content =
      status === "success-status" ? "✅ " + message : "⚠️ " + message;
    this.snackBar.open(content, "", {
      duration: 3000,
      panelClass: [status],
      verticalPosition: "top",
      horizontalPosition: "right"
    });
  }
}
