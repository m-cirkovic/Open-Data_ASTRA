import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Measurement,  } from '../models/Internal/measurement.model';
import { Site } from '../models/Internal/site.model';
import { AstraApiService } from '../services/astra-api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
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
  })

  errorSites = L.layerGroup();
  normalSites = L.layerGroup();

  map: L.Map;


  constructor(private _astraApi: AstraApiService) { }

  ngOnInit(): void {
    this._configureBaseLayer();
    this._configureDrawingLayer();
  }


  private _configureDrawingLayer() {
    this._astraApi.getSites({ dynamic: false }).subscribe(sites => {
      this._drawNormalSites(sites);
      this._drawSitesWithError(sites);
    });
  }

  private _configureBaseLayer() {
    this.map = L.map('map', { layers: [this.errorSites, this.normalSites], minZoom: 8, zoomControl: false }).addLayer(this.errorSites).addLayer(this.normalSites).setView([46.6, 7.7], 10);
    this.swissTopo.addTo(this.map);
    L.control.layers({ SwissTopo: this.swissTopo, OpenStreetMap: this.openStreetMap_CH, OpenTopoMap: this.openTopoMap }, { 'Fehlerhafte Messtationen': this.errorSites, 'Normale Messtationen': this.normalSites }, { position: 'topleft', hideSingleBase: true }).addTo(this.map)
  }

  private _drawSitesWithError(sites: Site[]) {
    sites
      .filter(s => s.lanes.filter(m => !m.measurements || m.measurements?.reasonForDataError)?.length > 0)
      .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'red' })
        .addTo(this.errorSites)
        .bindTooltip(this._getFehlermeldung(s))
      )
  }

  private _getFehlermeldung(site: Site): string {
    let meldung = `<h3>${site.specificLocation}</h3><table><tr><th>Spur</th><th>Meldung</th></tr>`
    site.lanes.forEach(l => meldung += `<tr><td>${Number.parseInt(l.siteId.split('.')[1])}</td><td> ${l.measurements?.reasonForDataError ? l.measurements.reasonForDataError : 'Keine Messdaten von der API Empfangen.'}</td>`)
    meldung += '</table>'
    return meldung;
  }

  private _drawNormalSites(sites: Site[]) {
    sites
      .filter(s => s.lanes.filter(m => m.measurements && !m.measurements.reasonForDataError)?.length > 0)
      .forEach(s => L.circleMarker([s.lanes[0].lat, s.lanes[0].lng], { color: 'green' })
        .addTo(this.normalSites)
        .bindTooltip(this._getLaneInfo(s))
      )
  }

  private _getLaneInfo(s: Site): string {
    let res = `<h3>${s.specificLocation}</h3>`;
    res += '<table><tr><th>Spur</th><th>Bezeichnung</th><th>Wert</th></tr>';
    s.lanes.forEach(l => {
      res += `<tr><td>${Number.parseInt(l.siteId.split('.')[1])}</td>${this._mapToHtml(l.measurements)}`
    })
    res += '</table>'
    return res;
  }

  private _mapToHtml(m: Measurement): string {
    let res = '';
    let iteration = 0;
    m.measurementData.forEach(d => res += `${iteration++ === 0 ? '' : '<tr><td><p></p></td>'}<td>${d.signifier.split(':')[1]}</td><td>${d.value}</td></tr>`)
    return res;
  }

}
