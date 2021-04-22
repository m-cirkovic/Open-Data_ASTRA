import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeasurementData } from '../models/Internal/measurement.model';
import { MeasuredValue } from '../models/Soap/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementIndexMapperService {

  private _indexMap: Map<string, {"vehicle": string, "unit": string}>

  constructor(private _http: HttpClient) {
    this._http.get('assets/measurementIndexMap.json').subscribe(ind => this._indexMap = new Map(Object.entries(ind)))
  }

  getVehicle(id: string):string{
    return this._indexMap.get(id).vehicle;
  }
  getUnit(id: string):string{
    return this._indexMap.get(id).unit;
  }
 
}


