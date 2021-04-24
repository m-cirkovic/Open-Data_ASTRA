import { Injectable } from '@angular/core';
import {Site} from '../../models/Internal/site.model';
import {Measurement} from '../../models/Internal/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }


  public siteToHtml(site: Site): string{
    return `<h1>Richtung ${site.locationName}</h1><p>Geschwindigkeit: ${site.avgSpeed}</p><p>Anzahl Fahrzeuge: ${site.avgVehicles}</p>`;
  }

}
