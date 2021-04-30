import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageMapperService {

private _errorMessageMap: Map<string, string>;

  constructor(private _http: HttpClient) { 
    this._http.get('assets/errorMessages.json').subscribe(msg => this._errorMessageMap = new Map(Object.entries(msg)));
  }

  getMsg(i: string): string{
    return this._errorMessageMap.get(i);
  }
}
