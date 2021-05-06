import { Injectable } from '@angular/core';
import {tileLayer} from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapLayerService {


  swissTopo = tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
    attribution: '&copy; <a href="https://www.swisstopo.ch/" target="_blank">Swisstopo</a>',
    bounds: [[45, 5], [48, 11]]
  });
  openStreetMap_CH = tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    bounds: [[45, 5], [48, 11]]
  });
  openTopoMap = tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | © <a href="http://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  private _mapLayers = {
    SwissTopo: this.swissTopo,
    OpenStreetMap: this.openStreetMap_CH,
    OpenTopoMap: this.openTopoMap
  };

  getMapLayers(){
    return this._mapLayers;
  }
}
