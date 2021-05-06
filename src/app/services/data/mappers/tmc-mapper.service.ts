import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';


import { TMC } from 'src/app/models/Internal/tmc.model';

@Injectable({
  providedIn: 'root'
})
export class TmcMapperService {

  private _tmcMap: Map<string, TMC>;

  constructor(private _http: HttpClient) {
    this._http.get<TMC[]>('assets/tmc.json').pipe(
      tap(tmcl => {
        this._tmcMap = new Map<string, TMC>();
        tmcl.forEach(tmc => this._tmcMap.set(tmc.locationCode.toString(), tmc))
      }
      ),
    ).subscribe()
  }

  getFirstName(specificLocation: number): string {
    return this._tmcMap.get(specificLocation?.toString())?.firstName;
  }
}

export interface TMCMap {
  [s: number]: TMC;
}
