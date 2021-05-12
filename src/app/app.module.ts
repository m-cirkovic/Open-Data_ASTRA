import { NgModule, OnInit } from '@angular/core';
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
import {PopUpService} from './services/map/pop-up.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { PieComponent } from './pie/pie.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ModalComponent,
    SplashScreenComponent,
    SideBarComponent,
    PieComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AccordionModule.forRoot(),
    ModalModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDialogModule,
    LeafletMarkerClusterModule
  ],
  providers: [
    BsModalService,
    ComponentLoaderFactory,
    PositioningService,
    PopUpService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
