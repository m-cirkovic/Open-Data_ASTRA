import { Injectable } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, mergeAll, reduce, tap } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';
import { Site } from 'src/app/models/Internal/site.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from '../../modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class LaneLayerService {

  constructor(
    private _astraCache: AstraCacheService,
    private _popupService: PopUpService,
    public _matDialog: MatDialog
  ) { }

  getAllLayers(): Observable<L.Control.LayersObject>{
    let siteLayersSeed: L.Control.LayersObject = {};
    return merge(this.getNormalLayers(), this.getErrorLayers()).pipe(
      reduce((acc, curr) => { return { ...acc, ...curr } }, siteLayersSeed),
      catchError((err, caught) => of({}))
    )
  }

  getNormalLayers(): Observable<L.Control.LayersObject> {
    return this._astraCache.sitesWithLatestMeasurements({ dynamicMeasurements: false, dynamicSites: false }).pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => !l.measurements?.reasonForDataError).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService)),
      map(l => { return { ['Normale Messstellen']: l } })
    )
  }

  getErrorLayers(): Observable<L.Control.LayersObject> {
    return this._astraCache.sitesWithLatestMeasurements({ dynamicMeasurements: false, dynamicSites: false }).pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => l.measurements?.reasonForDataError).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService)),
      map(l => { return { ['Messstellen mit Fehlern']: l } })
    )
  }

  mapToLayerGroup(sites: Site[], popup: PopUpService): L.LayerGroup {
    let layer = L.layerGroup();
    sites.forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'blue' }).addTo(layer).bindPopup(popup.siteToHtml(s)).on('popupopen', (a) => {
      const popUp = a.target.getPopup();
      popUp.getElement()
        .querySelector('.open-modal')
        .addEventListener('click', (e) => {
          s.lanes.forEach(a => this._astraCache.saveSiteId(a.siteId));
          this._astraCache.saveSpecificLocation(s.specificLocation);
          const dialogConfig = new MatDialogConfig();
          // The user can't close the dialog by clicking outside its body
          dialogConfig.disableClose = false;
          dialogConfig.id = 'modal-component';
          dialogConfig.height = '100%';
          dialogConfig.width = '100%';
          // https://material.angular.io/components/dialog/overview
          const modalDialog = this._matDialog.open(ModalComponent, dialogConfig);
        });
    }));
    return layer;
  }
}
