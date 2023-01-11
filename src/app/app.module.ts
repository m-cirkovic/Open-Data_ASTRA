import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineSimulatorComponent } from './line-simulator/line-simulator.component';
import { MapComponent } from './map/map.component';
import { ModalComponent } from './modal/modal.component';
import { PopUpService } from './services/map/pop-up.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TimeBarComponent } from './time-bar/time-bar.component';

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
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        LeafletMarkerClusterModule
    ],
    providers: [
        PopUpService,
        { provide: 'DYNAMIC', useValue: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
