import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';
import { Site } from 'src/app/models/Internal/site.model';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { ModalComponent } from 'src/app/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class LaneLayerService {

  constructor(
    private _astraCache: AstraCacheService,
    private _popupService: PopUpService,
    private _matDialog: MatDialog

  ) { }

  getAllLayers(options?: { dynamic?: boolean }): Observable<any> {
    const siteLayersSeed: L.Control.LayersObject = {};
    const sites = this._astraCache.sitesWithLatestMeasurements(options.dynamic);
    return sites.pipe(
      map(sites => sites.reduce((acc: Foo, curr) => {
        if (curr.lanes.filter(l => l.measurements?.reasonForDataError).length > 0) {
          acc['fehlerhaft'].sites.push(curr);
        } else if (curr.lanes.filter(l => l.measurements?.measurementData.filter(d => d.unit === 'km/h' && d.value < 30 && d.value >= 10).length > 0).length > 0) {
          acc['stockend'].sites.push(curr);
        } else if (curr.lanes.filter(l => l.measurements?.measurementData.filter(d => d.unit === 'km/h' && d.value < 10 && d.value > 0).length > 0).length > 0) {
          acc['stau'].sites.push(curr);
        } else {
          acc['normal'].sites.push(curr);
        }
        return acc;
      }, {
        'stau': { color: 'red', sites: [] },
        'fehlerhaft': { color: 'blue', sites: [] },
        'stockend': { color: 'orange', sites: [] },
        'normal': { color: 'blue', sites: [] }
      })
      ),
      map(sites => {
        let a: L.Control.LayersObject = {};
        Object.entries(sites).forEach(s => {
          if(s[1].sites){
            a[s[0]] = this.mapToLayerGroup(s[1].sites, this._popupService, s[1].color)
          }
        })
        return a;
      }
      )
    )
  }

  private mapToLayerGroup(sites: Site[], popup: PopUpService, color: string): L.LayerGroup {
    const layer = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        let c = ` marker-cluster-${color ? color : 'blue'}`;
        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
        });
      }
    });
    sites.filter(s => s.lanes[0]).forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color }).addTo(layer).bindPopup(popup.siteToHtml(s)).on('popupopen', (a) => {
      const popUp = a.target.getPopup();
      popUp.getElement()
        .querySelector('.open-modal')
        .addEventListener('click', (e) => {
          this._astraCache.saveSite(s);
          const dialogConfig = new MatDialogConfig();
          // The user can't close the dialog by clicking outside its body
          dialogConfig.disableClose = false;
          dialogConfig.id = 'modal-component';
          dialogConfig.maxHeight = '75vh';
          dialogConfig.maxWidth = '800px';
          // https://material.angular.io/components/dialog/overview
          const modalDialog = this._matDialog.open(ModalComponent, dialogConfig);
        });
    }));
    return layer;
  }
}

interface Foo {
  [name: string]: Bar
}
interface Bar {
  color: string;
  sites: Site[]
}
