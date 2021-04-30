import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {ComponentLoaderFactory} from 'ngx-bootstrap/component-loader';
import {PositioningService} from 'ngx-bootstrap/positioning';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MarkerService} from './services/marker.service';
import {PopUpService} from './services/pop-up.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {SplashScreenStateService} from './services/splash-screen-state.service';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';






@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ModalComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AccordionModule.forRoot(),
    ModalModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [
    BsModalService,
    ComponentLoaderFactory,
    PositioningService,
    MarkerService,
    PopUpService,
    SplashScreenStateService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
