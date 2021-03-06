import { Injectable } from '@angular/core';
import { Site } from '../../models/Internal/site.model';
import { Measurement, MeasurementData } from '../../models/Internal/measurement.model';
import { AverageService } from '../data/mappers/average.service';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  public siteToHtml(site: Site): string {
    const measurements = site.lanes.map(s => s.measurements);
    const noError = measurements.filter(m => !m?.reasonForDataError);
    const error = measurements.filter(m => m?.reasonForDataError);
    return `<div class ="container-fluid" style="color:gray;">
            <div><span class="h4">Richtung ${site.locationName}</span> <br/><span class="p"> ${PopUpService.getId(site.lanes[0].siteId)}</span></div>
            <hr>
            <p>
            <span title="Durchschnittsgeschwindigkeit über alle Spuren"><strong>Geschwindigkeit:</strong> ${AverageService.getAvgVehicleSpeed(noError)} km/h </span><br>
            <span title="Durchschnitt über alle Spuren"><strong>Anzahl Fahrzeuge pro Stunde:</strong> ${AverageService.getAvgVehicles(noError)}</span>
            </p>
            ${PopUpService.getErrorMsg(error)}
            <button class="open-modal filter-button" >Details</button>
            </div>`;
  }

  static getErrorMsg(measurements: Measurement[]): string {
    if (measurements?.length > 0) {
      return `<p class="text-danger">Dieser Standort hat Fehlerhafte Messungen.</p>`
    } else {
      return '';
    }
  }

  static getId(id: string){
    let split = id.split('.');
    return split.length === 2 ? split[0] : split[0] + '.' + split[1];
  }

}
