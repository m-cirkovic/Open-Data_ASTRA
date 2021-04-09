import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MeasurementData } from '../models/Internal/measurement.model';
import { MeasurementCharacteristics } from '../models/Internal/site.model';
import { AstraApiService } from '../services/astra-api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {


  map: L.Map;
  drawingLayer = L.layerGroup();

  constructor(private _astraApi: AstraApiService) { }

  ngOnInit(): void {
    this._astraApi.getNestedSites().subscribe();
    this._setupSwissTopo();
    this._astraApi.getNestedSites().subscribe(ms => ms.forEach(ms => L.circleMarker([ms.lat, ms.lng], { color: 'red'}).addTo(this.map).bindTooltip(this.mapToHtml(ms.measurements.measurements))))
  }


  private mapToHtml(c: MeasurementData[]): string{
    let res: string = '<table><tr><th>Bezeichnung</th><th>Wert</th></tr>';
    c.forEach(m => res += `<tr><td>${m.signifier}</td><td>${m.value}</td></tr>`)
    res += '</table>'
    return res;
  }

  private _setupSwissTopo(){
    this.map = L.map('map').setView([46.6, 7.7], 10)
    var swissTopo = L.tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg');
    swissTopo.addTo(this.map);
    this.map.setMinZoom(8);
  }

}
