import { Injectable } from '@angular/core';
import {TileLayer, tileLayer} from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapLayerService {


  swissTopo = tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
    attribution: '&copy; <a href="https://www.swisstopo.ch/" target="_blank">Swisstopo</a>',
   
  });
  openStreetMap_CH = tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
   
  });
  openTopoMap = tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | © <a href="http://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    
  });
  stadiamap = tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    
  });
  private _mapLayers = {
    SwissTopo: this.swissTopo,
    OpenStreetMap: this.openStreetMap_CH,
    OpenTopoMap: this.openTopoMap,
    Smoothmap: this.stadiamap
  };

  private mapLayerMap: Map<string, TileLayer> =new Map(Object.entries({
    'default': this.stadiamap,
    'swisstopo': this.swissTopo,
    'osm': this.openStreetMap_CH,
    'opentopo': this.openTopoMap,
    'stadia': this.stadiamap
  }))

  getMapLayers(){
    return this._mapLayers;
  }

  getMap(mapId?: string): TileLayer{
    return this.mapLayerMap.get(mapId ? mapId: 'default');
  }
}
