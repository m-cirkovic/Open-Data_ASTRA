import { Component } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { catchError, reduce, tap } from 'rxjs/operators';
import { LaneLayerService } from './services/map/lane-layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Verkehrszähler';

  siteLayer$: Observable<any> = this._layerService.getAllLayers();

  constructor(private _layerService: LaneLayerService) {
  }
}
