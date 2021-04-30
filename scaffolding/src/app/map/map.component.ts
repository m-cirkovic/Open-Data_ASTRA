import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { AstraApiService } from '../services/astra-api.service';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerService } from '../services/marker.service';
import { tap } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';


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

  private map;
  public mapLayers: L.Control.LayersObject = {
    SwissTopo: this.swissTopo,
    OpenStreetMap: this.openStreetMap_CH,
    OpenTopoMap: this.openTopoMap
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private _astraApi: AstraApiService,
    private _elementRef: ElementRef,
    public config: NgbModalConfig,
    private markerService: MarkerService) {
  }
/*
  ngOnInit(): void {
    this.activatedRoute.snapshot.data.itemsList
      .subscribe(res => {
        console.log({ res });
      });
    console.log(this.markerService.getLayers());
  }
*/


  ngAfterViewInit(): void {
    this._initMap();
    this._astraApi.getMeasurements().subscribe();
  }

  private _initMap(): void {
    this.map = L.map('map', {
      minZoom: 8,
      zoomControl: false
    }).setView([46.6, 7.7], 10);
    this.swissTopo.addTo(this.map);
    L.control.layers(this.mapLayers, undefined, { position: 'topleft' }).addTo(this.map);
  }

}

