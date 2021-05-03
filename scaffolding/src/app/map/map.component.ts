import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as L from 'leaflet';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LaneLayerService } from '../services/map/lane-layer.service';
import { PopUpService } from '../services/map/pop-up.service';
import { ActivatedRoute } from '@angular/router';
import { AstraCacheService } from '../services/data/astra/astra-cache.service';
import { concat, merge } from 'rxjs';
import { concatAll, map, reduce, tap } from 'rxjs/operators';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class MapComponent implements AfterViewInit {

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

  private _map: L.Map;
  public control: L.Control;
  public siteLayers: L.Control.LayersObject = {};

  public mapLayers: L.Control.LayersObject = {
    SwissTopo: this.swissTopo,
    OpenStreetMap: this.openStreetMap_CH,
    OpenTopoMap: this.openTopoMap
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private _elementRef: ElementRef,
    public config: NgbModalConfig,
    private _layerService: LaneLayerService,
    private _popupService: PopUpService) {
  }


  ngAfterViewInit(): void {
    this._initMap();

    let a = this._layerService.getErrorLayers()
    let b = this._layerService.getNormalLayers()

    merge(a, b).pipe(
      tap(a => a),
      reduce((acc, curr) => { return { ...acc, ...curr } }, this.siteLayers),
      tap(console.log),
      tap(layers => L.control.layers(this.mapLayers, layers, { position: 'topleft' }).addTo(this._map))
    ).subscribe()

  }

  private _initMap(): void {
    this._map = L.map('map', {
      minZoom: 8,
      zoomControl: false
    }).setView([46.6, 7.7], 10);
    this.swissTopo.addTo(this._map);

  }

}

