import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class LaneLayerService {

  constructor(
    private _astraCache: AstraCacheService, popupService: PopUpService
    ) { }


  getLayers(): Observable<L.LayerGroup[]>{
    return this._astraCache.sitesWithLatestMeasurements().pipe(
      map(sites => {
        
        return [L.layerGroup()]
      })
    )
  }
}
