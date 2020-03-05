import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { SharedModule } from "../shared/shared.module";
import { LoginComponent } from "./login/login.component";
import { NgxsModule } from "@ngxs/store";
import { LoginState } from "./+state/login.state";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxsModule.forRoot([LoginState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule {}
