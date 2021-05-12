import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapLayerService } from '../services/map/map-layer.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class MapComponent implements OnInit {

  public map: L.Map;
  public mapControl: L.Control;

  @Input() public siteLayers: L.Control.LayersObject;

  public mapLayers: L.Control.LayersObject;

  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData = [];

  constructor(
    public config: NgbModalConfig,
    private _mapLayerService: MapLayerService
  ) { }


  ngOnInit(): void {
    this._initMap();
    this._addControlToMap();
    this._addLayersToMap();
  }

  private _initMap(): void {
    this.mapLayers = this._mapLayerService.getMapLayers();
    this.map = L.map('map', {
      maxBoundsViscosity: 1.0,
      minZoom: 8,
      zoomControl: false,
      layers: [Object.values(this.mapLayers)[0]]
    }).setView([46.6, 7.7], 1);
  }

  private _addLayersToMap() {
    Object.values(this.siteLayers).forEach(val => val.addTo(this.map))
  }
  private _removeLayersFromMap() {
    Object.values(this.siteLayers).forEach(val => val.removeFrom(this.map))
  }
  private _addControlToMap() {
    this.mapControl = L.control.layers(this.mapLayers, this.siteLayers, { position: 'topright', collapsed: false }).addTo(this.map)
  }
  private _removeControlFromMap() {
    this.mapControl.remove();
  }
  public updateMap(newLayers: L.Control.LayersObject) {
    this._removeLayersFromMap();
    this._removeControlFromMap();
    this.siteLayers = newLayers;
    this._addLayersToMap();
    this._addControlToMap();
  }
}

