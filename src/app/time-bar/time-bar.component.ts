import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';
import { AstraCacheService } from '../services/data/astra/astra-cache.service';
import { LaneLayerService } from '../services/map/lane-layer.service';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrls: ['./time-bar.component.css']
})
export class TimeBarComponent implements OnInit {

  @Output() updateData = new EventEmitter();
  
  @Input() map: Map;
  timebar: Control;
  dynamic = false;
  loading = false;

  constructor(private _astraCache: AstraCacheService, private _laneLayers: LaneLayerService) { }

  ngOnInit(): void {
    let TimeBar = Control.extend({
      onAdd(map: Map) {
        return DomUtil.get('timebar')
      },
      onRemove(map: Map) { }
    })
    this.timebar = new TimeBar({
      position: 'bottomright'
    }).addTo(this.map) 
  }

  date(): Date{
    return this._astraCache.getMeasurementDate();
  }
  current(): boolean{
    return Date.now() - this._astraCache.getMeasurementDate().valueOf() < 1000 * 60;
  }

  changeData(): void {
    this.loading = true;
    this.dynamic = !this.dynamic;
    this._laneLayers.getAllLayers({dynamic: this.dynamic}).subscribe(layers => {
      this.updateData.emit(layers);
      this.loading = false;
    });
  }
}
