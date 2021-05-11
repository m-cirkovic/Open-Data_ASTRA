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
    let measurements = site.lanes.map(s => s.measurements);
    let noError = measurements.filter(m => !m?.reasonForDataError);
    let error = measurements.filter(m => m?.reasonForDataError);
    return `<h1>Richtung ${site.locationName}</h1><p>Geschwindigkeit: ${AverageService.getAvgVehicleSpeed(noError)} km/h</p><p>Anzahl Fahrzeuge pro Stunde: ${AverageService.getAvgVehicles(noError)}</p>${PopUpService.getErrorMsg(error)}<button mat-raised-button id="logout-button" class="open-modal">Details</button>`;
  }

  static getErrorMsg(measurements: Measurement[]): string {
    if (measurements?.length > 0) {
      return `<p class="text-danger">Dieser Standort hat Fehlerhafte Messungen.</p>`
    } else {
      return '';
    }
  }
  
}
