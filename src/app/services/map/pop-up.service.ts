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
    return `<div class ="container-fluid">
            <h2>Richtung ${site.locationName}</h2>
            <hr>
            <p>
            <strong>Geschwindigkeit:</strong> ${AverageService.getAvgVehicleSpeed(noError)} km/h <br>
            <strong>Anzahl Fahrzeuge pro Stunde:</strong> ${AverageService.getAvgVehicles(noError)}</p>
            ${PopUpService.getErrorMsg(error)}
            <button class="open-modal tn btn-secondary btn-sm" >Details</button>
            </div>`;
  }

  static getErrorMsg(measurements: Measurement[]): string {
    if (measurements?.length > 0) {
      return `<p class="text-danger">Dieser Standort hat Fehlerhafte Messungen.</p>`
    } else {
      return '';
    }
  }

}
