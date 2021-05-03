import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';
import { Site } from 'src/app/models/Internal/site.model';

@Injectable({
  providedIn: 'root'
})
export class LaneLayerService {

  constructor(
    private _astraCache: AstraCacheService,
    private _popupService: PopUpService
  ) { }

  getNormalLayers(): Observable<L.Control.LayersObject> {
    return this._astraCache.sitesWithLatestMeasurements({ dynamicMeasurements: false, dynamicSites: false }).pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => !l.measurements?.reasonForDataError))),
      map(s => this.mapToLayerGroup(s, this._popupService)),
      map(l => {return {['Normale Messstellen']: l}})
    )
  }

  getErrorLayers(): Observable<L.Control.LayersObject> {
    return this._astraCache.sitesWithLatestMeasurements({ dynamicMeasurements: false, dynamicSites: false }).pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => l.measurements?.reasonForDataError))),
      tap(console.log),
      map(s => this.mapToLayerGroup(s, this._popupService)),
      map(l => {return {['Messstellen mit Fehlern']: l}})
    )
  }

  mapToLayerGroup(sites: Site[], popup: PopUpService): L.LayerGroup {
    let layer = L.layerGroup();

    sites.forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'blue' }).addTo(layer).bindPopup(popup.siteToHtml(s)))
    return layer;
  }
  getLayers(): Observable<{ errorLayer: L.LayerGroup; normalLayer: L.LayerGroup }> {
    return this._astraCache.sitesWithLatestMeasurements().pipe(
      map(sites => {
        let errorLayer = L.layerGroup();
        let normalLayer = L.layerGroup();
        return { errorLayer, normalLayer }
      })
    )
  }
}
