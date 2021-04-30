import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class LaneLayerService {

  constructor(
    private _astraCache: AstraCacheService, 
    private _popupService: PopUpService
    ) { }


    getAll(): Observable<L.LayerGroup>{
      return this._astraCache.sitesWithLatestMeasurements({dynamicMeasurements:false, dynamicSites:false}).pipe(
        map(l => {
          let all = L.layerGroup();
          l.map(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], {color: 'blue'}).addTo(all).bindPopup(this._popupService.siteToHtml(s)));
          return all;
        })
      )
    }

    getNormalLayers(): Observable<L.LayerGroup>{
      this._astraCache.sitesWithLatestMeasurements().pipe(
        map(s => s)
      )
      return of(L.layerGroup());
    }

    getErrorLayers(): Observable<L.LayerGroup>{
      return of(L.layerGroup());
    }

  getLayers(): Observable<{errorLayer:L.LayerGroup; normalLayer: L.LayerGroup}>{
    return this._astraCache.sitesWithLatestMeasurements().pipe(
      map(sites => {
        let errorLayer = L.layerGroup();
        let normalLayer = L.layerGroup();
        return {errorLayer, normalLayer}
      })
    )
  }
}
