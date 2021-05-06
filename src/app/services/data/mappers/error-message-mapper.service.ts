import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeasuredValue, SiteMeasurements } from 'src/app/models/Soap/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageMapperService {

private _errorMessageMap: Map<string, string>;

  constructor(private _http: HttpClient) { 
    this._http.get('assets/errorMessages.json').subscribe(msg => this._errorMessageMap = new Map(Object.entries(msg)));
  }

  getMsg(i: SiteMeasurements): string{
    let msg = (i.measuredValue as MeasuredValue).measuredValue.basicData?.vehicleFlow.reasonForDataError.values.value['#text'];
    return this._errorMessageMap.get(msg);
  }
}
