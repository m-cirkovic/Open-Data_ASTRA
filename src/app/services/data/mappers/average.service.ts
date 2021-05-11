import { Injectable } from '@angular/core';
import { Measurement, MeasurementData } from 'src/app/models/Internal/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class AverageService {

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
      if(f.value !== 0){  
        flowSum += f.value;
        totalNum++;
      }
    })
    let res = flowSum / totalNum;
    return Number.isNaN(res) ? 0 : Math.round(res);
  }

  static getAvgVehicles(measurements: Measurement[]): number {
    return AverageService.getAvg(measurements, 'Fahrzeug/h')
  }

  static getAvgVehicleSpeed(measurements: Measurement[]): number {
    return AverageService.getAvg(measurements, 'km/h')
  }

}
