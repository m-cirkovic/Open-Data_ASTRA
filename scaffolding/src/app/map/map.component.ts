import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LaneLayerService } from '../services/map/lane-layer.service';
import { merge, Observable } from 'rxjs';
import { reduce, tap } from 'rxjs/operators';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class MapComponent implements OnInit {

  swissTopo = L.tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
    attribution: '&copy; <a href="https://www.swisstopo.ch/" target="_blank">Swisstopo</a>',
    bounds: [[45, 5], [48, 11]]
  });
  openStreetMap_CH = L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    bounds: [[45, 5], [48, 11]]
  });
  openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | © <a href="http://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  public map: L.Map;
  public control: L.Control;

  public mapLayers: L.Control.LayersObject = {
    SwissTopo: this.swissTopo,
    OpenStreetMap: this.openStreetMap_CH,
    OpenTopoMap: this.openTopoMap
  };
  
  @Input() siteLayers: L.Control.LayersObject;

  constructor(
    public config: NgbModalConfig
  ) {
  }


  ngOnInit(): void {
    this._initMap();
    L.control.layers(this.mapLayers, this.siteLayers, {position: 'topright', collapsed: false}).addTo(this.map)
    Object.keys(this.siteLayers).forEach(key => this.siteLayers[key].addTo(this.map))
  }

  private _initMap(): void {
    this.map = L.map('map', {
      minZoom: 8,
      zoomControl: false
    }).setView([46.6, 7.7], 10);
    this.swissTopo.addTo(this.map);

  }

  public updateMap(newLayers: L.Control.LayersObject){
    console.log(newLayers);
  }

}

