import { Injectable } from '@angular/core';
import { Site } from '../../models/Internal/site.model';
import { Measurement, MeasurementData } from '../../models/Internal/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }


  public siteToHtml(site: Site): string {
    let measurements: Measurement[] = [];
    site.lanes.forEach(s => measurements.push(s.measurements));
    let noError = measurements.filter(m => !m?.reasonForDataError);
    let error = measurements.filter(m => m?.reasonForDataError);
    return `<h1>Richtung ${site.locationName}</h1><p>Geschwindigkeit: ${PopUpService.getAvgVehicleSpeed(noError)} </p><p>Anzahl Fahrzeuge: ${PopUpService.getAvgVehicles(noError)}</p>${PopUpService.getErrorMsg(error)}`;
  }

  static getAvg(measurements: Measurement[], matcher: string): number {
    let flowSum = 0;
    let totalNum = 0;
    let flowData: MeasurementData[] = [];
    measurements.forEach(m => m?.measurementData.forEach(d => {
      if (d.unit === matcher) {
        flowData.push(d)
      }
    }))
    flowData.forEach(f => {
      flowSum += f.value;
      totalNum++;
    })
    let res = flowSum / totalNum;
    return Number.isNaN(res) ? 0 : res;
  }

  static getAvgVehicles(measurements: Measurement[]): number {
    return PopUpService.getAvg(measurements, 'Fahrzeug/h')
  }

  static getAvgVehicleSpeed(measurements: Measurement[]): number {
    return PopUpService.getAvg(measurements, 'km/h')
  }
  static getErrorMsg(measurements: Measurement[]): string {
    if (measurements?.length > 0) {
      return `<p class="text-danger">Dieser Standort hat Fehlerhafte Messungen.</p>`
    }else{
      return '';
    }
  }
  static measurementDataReducer(acc: number, curr: MeasurementData): number {
    return acc + curr.value;
  }
}
