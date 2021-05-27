import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';
import { Subscription } from 'rxjs';
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

  private _backendPoll: Subscription;

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
    })
      .addTo(this.map)

  }

  date(): Date {
    return this._astraCache.getMeasurementDate(this.dynamic);
  }
  current(): boolean {
    return this._astraCache.isMostCurrentDate();
  }

  changeData(): void {
    this.dynamic = !this.dynamic;
    this._backendPoll?.unsubscribe();
    this.getNewMeasurement();

  }

  getNewMeasurement(): void {
    this.loading = true;
    this._backendPoll = this._laneLayers.getAllLayers({ dynamic: this.dynamic }).subscribe(layers => {
      this.updateData.emit(layers);
      this.loading = false;
    });
    setTimeout(()=>{this.getNewMeasurement()}, 60000 - (Date.now() - 20000) % (1000 * 60))
  }
}
