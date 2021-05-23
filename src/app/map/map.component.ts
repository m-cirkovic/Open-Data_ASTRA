import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapLayerService } from '../services/map/map-layer.service';
import { Subject } from 'rxjs';
import { BoundsService } from '../services/map/BoundsService';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class MapComponent implements OnInit{
  
  @Input() public siteLayers: L.Control.LayersObject;

  layersSubject = new Subject<L.Control.LayersObject>();

  public map: L.Map;
  public mapControl: L.Control;

  public savedSiteLayers: L.Control.LayersObject;
  public mapLayer: L.TileLayer;

  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData = [];

  constructor(
    public config: NgbModalConfig,
    private _mapLayerService: MapLayerService
  ) { 
    
  }

  ngOnInit(): void {
    this.savedSiteLayers =this.siteLayers;
    this._initMap();
    this._addLayersToMap();
  }

  private _initMap(): void {
    this.mapLayer = this._mapLayerService.getMap();
    this.map = L.map('map', {
      maxBoundsViscosity: 1.0,
      minZoom: 8,
      zoomControl: false,
      layers: [this.mapLayer]
    }).setView([46.6, 7.7], 10);
    BoundsService.bounds = this.map.getBounds();
    this.map.doubleClickZoom.disable(); 
  }

  private _addLayersToMap() {
    Object.values(this.savedSiteLayers).forEach(val => this.map.addLayer(val))
  }
  private _removeLayersFromMap() {
    Object.values(this.savedSiteLayers).forEach(val => this.map.removeLayer(val))
  }
  
  public updateMap(newLayers: L.Control.LayersObject) {
    this.layersSubject.next(newLayers);
  }

  public updateFilter(newLayers: L.Control.LayersObject){
    this._removeLayersFromMap();
    this.savedSiteLayers = newLayers;
    this._addLayersToMap();
  }

  public updateMapLayer(newMapId: string){
    this.map.removeLayer(this.mapLayer);
    this.mapLayer = this._mapLayerService.getMap(newMapId)
    this.map.addLayer(this.mapLayer)
  }
}