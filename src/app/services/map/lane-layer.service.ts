import { Injectable } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, reduce, tap } from 'rxjs/operators';
import { AstraCacheService } from '../data/astra/astra-cache.service';
import * as L from 'leaflet';
import { PopUpService } from './pop-up.service';
import { Site } from 'src/app/models/Internal/site.model';
import { AverageService } from '../data/mappers/average.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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

  getAllLayers(options?: { dynamic?: boolean }): Observable<L.Control.LayersObject> {
    const siteLayersSeed: L.Control.LayersObject = {};
    const sites = this._astraCache.sitesWithLatestMeasurements(options.dynamic);
    return merge(this._getNormalLayers(sites), this._getErrorLayers(sites), this._getJamLayers(sites), this._getStagnatingLayers(sites)).pipe(
      reduce((acc, curr) => ({ ...acc, ...curr }), siteLayersSeed),
      catchError((err, caught) => of({}))
    );
  }

  private _getStagnatingLayers(s: Observable<Site[]>): Observable<L.Control.LayersObject> {
    return s.pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => !l.measurements?.reasonForDataError).length > 0)),
      map(s => s.filter(site => site.lanes.filter(l => l.measurements?.measurementData.filter(m => m.value >= 10 && m.value < 30 && m.value > 0 && m.unit === 'km/h').length > 0).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService, 'orange')),
      map(l => ({ ['stockend']: l })),
    );
  }

  private _getJamLayers(s: Observable<Site[]>): Observable<L.Control.LayersObject> {
    return s.pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => !l.measurements?.reasonForDataError).length > 0)),
      map(s => s.filter(site => site.lanes.filter(l => l.measurements?.measurementData.filter(m => m.value < 10 && m.value > 0 && m.unit === 'km/h').length > 0).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService, 'red')),
      map(l => ({ ['stau']: l })),
    );
  }

  private _getNormalLayers(s: Observable<Site[]>): Observable<L.Control.LayersObject> {
    return s.pipe(
      tap(a => console.log(a[0].lanes[0].measurements.publicationTime)),
      map(s => s.filter(sites => sites.lanes.filter(l => !l.measurements?.reasonForDataError).length > 0)),
      map(s => s.filter(site => site.lanes.filter(l => l.measurements?.measurementData.filter(m => m.value > 30 && m.unit === 'km/h').length > 0).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService, 'blue')),
      map(l => ({ ['normal']: l })),
    );
  }

  private _getErrorLayers(s: Observable<Site[]>): Observable<L.Control.LayersObject> {
    return s.pipe(
      map(s => s.filter(sites => sites.lanes.filter(l => l.measurements?.reasonForDataError).length > 0)),
      map(s => this.mapToLayerGroup(s, this._popupService, 'blue')),
      map(l => ({ ['fehlerhaft']: l }))
    );
  }

  mapToLayerGroup(sites: Site[], popup: PopUpService, color: string): L.LayerGroup {
    const layer = L.markerClusterGroup({
      disableClusteringAtZoom: 12,
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';
        if (color === 'red') {
          c += 'red';
        }
        else if (color === 'orange') {
          c += 'orange';
        }
        else {
          c += 'blue';
        }
        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
        });
      }
    });
    sites.forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color }).addTo(layer).bindPopup(popup.siteToHtml(s)).on('popupopen', (a) => {
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
          dialogConfig.maxWidth = '60vw';
          // https://material.angular.io/components/dialog/overview
          const modalDialog = this._matDialog.open(ModalComponent, dialogConfig);
        });
    }));
    return layer;
  }

  private _getAvg(site: Site): number {
    const measurements = site.lanes.map(s => s.measurements);
    return AverageService.getAvg(measurements.filter(m => !m?.reasonForDataError), 'km/h');
  }

}
