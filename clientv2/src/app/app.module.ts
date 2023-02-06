import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, IsUserLogged } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './shared/api.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    NgbModule,
    HttpClientModule,
    NgbTooltipModule
  ],
  providers: [ApiService, IsUserLogged],
  bootstrap: [AppComponent]
})
export class AppModule { }
