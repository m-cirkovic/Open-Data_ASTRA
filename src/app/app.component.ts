import { Component } from '@angular/core';
import * as L from 'leaflet';
import { Observable, } from 'rxjs';
import { LaneLayerService } from './services/map/lane-layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Verkehrszähler';

  siteLayer$: Observable<any> = this._layerService.getAllLayers({ dynamic: false });



  constructor(private _layerService: LaneLayerService) {
  }
}
