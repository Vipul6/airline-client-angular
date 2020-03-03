import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./modules/material.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideDirective } from "./directives/click-outside.directive";

@NgModule({
  declarations: [SpinnerComponent, ClickOutsideDirective],
  exports: [
    CommonModule,
    MaterialModule,
    SpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
    ClickOutsideDirective
  ]
})
export class SharedModule {}
