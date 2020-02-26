import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./modules/material.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SpinnerComponent],
  exports: [
    CommonModule,
    MaterialModule,
    SpinnerComponent,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule {}
