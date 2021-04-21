import { Injectable } from '@angular/core';
import {Site} from '../models/Internal/site.model';
import {Measurement} from '../models/Internal/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  public getErrorSitePopUp(data: Site): string {
    let meldung = `<h3>${data.specificLocation}</h3><table><tr><th>Spur</th><th>Meldung</th></tr>`;
    data.lanes.forEach(l => meldung += `<tr><td>${Number.parseInt(l.siteId.split('.')[1])}</td><td> ${l.measurements?.reasonForDataError ? l.measurements.reasonForDataError : 'Keine Messdaten von der API Empfangen.'}</td>`);
    meldung += '</table>';
    return meldung;
  }

  public getSitePopUp(data: Site): string {
    let res = `<h3>Station Nr. ${data.specificLocation}</h3>`;
    res += '<table><tr><th>Spur</th><th>Bezeichnung</th><th>Wert</th></tr>';
    data.lanes.forEach(l => {
      res += `<tr><td>${Number.parseInt(l.siteId.split('.')[1])}</td>${this._mapToHtml(l.measurements)}`;
    });
    res += '</table>';
    res += '<button mat-raised-button id="logout-button" class="open-modal">mehr Informationen...</button>';
    return res;
  }

  private _mapToHtml(m: Measurement): string {
    let res = '';
    let iteration = 0;
    m.measurementData.forEach(d => res += `${iteration++ === 0 ? '' : '<tr><td><p></p></td>'}<td>${d.signifier.split(':')[1]}</td><td>${d.value}</td></tr>`);
    return res;
  }
}
