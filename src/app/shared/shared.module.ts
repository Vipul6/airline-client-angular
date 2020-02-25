import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./modules/material.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";

@NgModule({
  declarations: [SpinnerComponent],
  exports: [CommonModule, MaterialModule, SpinnerComponent]
})
export class SharedModule {}
