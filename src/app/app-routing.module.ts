import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./core/home/home.component";
import { AboutComponent } from "./core/about/about.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "flights",
    loadChildren: () =>
      import("./flight/flight.module").then(mod => mod.FlightModule)
  },
  {
    path: "about",
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
