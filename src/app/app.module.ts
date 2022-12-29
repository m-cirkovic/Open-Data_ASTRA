import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PopUpService} from './services/map/pop-up.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';
import { MatDialogModule} from '@angular/material/dialog';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TimeBarComponent } from './time-bar/time-bar.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import { LineSimulatorComponent } from './line-simulator/line-simulator.component';

@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        ModalComponent,
        SplashScreenComponent,
        SideBarComponent,
        TimeBarComponent,
        LineSimulatorComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        MatDialogModule,
        LeafletMarkerClusterModule
    ],
    providers: [
        PopUpService,
        { provide: 'DYNAMIC', useValue: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
