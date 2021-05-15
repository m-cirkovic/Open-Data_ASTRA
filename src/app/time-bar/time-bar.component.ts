import { Component, Input, OnInit } from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';
import { AstraCacheService } from '../services/data/astra/astra-cache.service';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrls: ['./time-bar.component.css']
})
export class TimeBarComponent implements OnInit {

  @Input() map: Map;
  timebar: Control;

  constructor(private _astraCache: AstraCacheService) { }

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

}
