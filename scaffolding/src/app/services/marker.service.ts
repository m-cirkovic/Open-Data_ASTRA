import { Injectable } from '@angular/core';
import {AstraApiService} from './astra-api.service';
import * as L from 'leaflet';
import {PopUpService} from './pop-up.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from '../modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private _astraApi: AstraApiService,
              private popupService: PopUpService,
              public matDialog: MatDialog) { }

  makeSiteMarkers(map: L.Map): void {
    this._astraApi.getSites({dynamic: false}).subscribe(sites => {
      // errors
      sites
        .filter(s => s.lanes.filter(m => !m.measurements || m.measurements?.reasonForDataError)?.length > 0)
        .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], {color: 'red'})
        .addTo(map).bindPopup(this.popupService.getErrorSitePopUp(s)));
      // good sites
      sites
        .filter(s => s.lanes.filter(m => m.measurements && !m.measurements.reasonForDataError)?.length > 0)
        .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], {color: 'green'})
        .addTo(map).bindPopup(this.popupService.getSitePopUp(s)).on('popupopen', (a) => {
          const popUp = a.target.getPopup();
          popUp.getElement()
            .querySelector('.open-modal')
            .addEventListener('click', (e) => {
              console.log('hallo');
              const dialogConfig = new MatDialogConfig();
              // The user can't close the dialog by clicking outside its body
              dialogConfig.disableClose = true;
              dialogConfig.id = 'modal-component';
              dialogConfig.height = '350px';
              dialogConfig.width = '600px';
              // https://material.angular.io/components/dialog/overview
              const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
            });
        }));
    });
  }

  // https://morioh.com/p/903aa1355d7f -> to scale circle

}
