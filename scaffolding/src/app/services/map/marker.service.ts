import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { from, Observable, of } from 'rxjs';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import { catchError, concatAll, map, mergeMap, tap } from 'rxjs/operators';
import {ModalInfoService} from './modal-info.service';
import { AstraApiService } from '../data/astra/astra-api.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private popupService: PopUpService,
    public matDialog: MatDialog,
    private _astraCache: AstraCacheService,
    private modalInfoService: ModalInfoService,
   ) { }
  
    layers: Observable<L.LayerGroup[]>;

  makeLayers(): Observable<L.LayerGroup[]> {
    return of([L.layerGroup()]);
   /*return this._astraApi.getSites({ dynamic: false })
      .pipe(
        map(sites => {
          const errorLayer = L.layerGroup();
          const normalLayer = L.layerGroup();
          // errors
          sites
            .filter(s => s.lanes.filter(m => !m.measurements || m.measurements?.reasonForDataError)?.length > 0)
            .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'red' })
              .addTo(errorLayer).bindPopup(this.popupService.getErrorSitePopUp(s)));
          // good sites
          sites
            .filter(s => s.lanes.filter(m => m.measurements && !m.measurements.reasonForDataError)?.length > 0)
            .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'green' })
              .addTo(normalLayer).bindPopup(this.popupService.getSitePopUp(s)).on('popupopen', (a) => {
                const popUp = a.target.getPopup();
                popUp.getElement()
                  .querySelector('.open-modal')
                  .addEventListener('click', (e) => {
                    this.modalInfoService.saveInfo(s);
                    const dialogConfig = new MatDialogConfig();
                    // The user can't close the dialog by clicking outside its body
                    dialogConfig.disableClose = false;
                    dialogConfig.id = 'modal-component';
                    dialogConfig.height = '350px';
                    dialogConfig.width = '600px';
                    // https://material.angular.io/components/dialog/overview
                    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
                  });
              }));
          return [errorLayer, normalLayer];
        })
      );*/
  }

  getLayers(): Observable<L.LayerGroup[]>{
    return this.layers;
  }


  // https://morioh.com/p/903aa1355d7f -> to scale circle

}
