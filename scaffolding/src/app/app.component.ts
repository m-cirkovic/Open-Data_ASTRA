import { Component } from '@angular/core';
import * as Parser from 'fast-xml-parser'
import { SoapWrapper } from './models/Soap/soap.model';
import { MeasurementPayloadPublication } from './models/Soap/measurement.model';
import { SitePayloadPublication } from './models/Soap/site.model';
import { AstraApiService } from './services/astra-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scaffolding';

  constructor(private _astraApi: AstraApiService) {
  }

  getMeasurementsites() {
    this._astraApi.getSites()
      .subscribe();
  }

  getMeasurements() {
    this._astraApi.getMeasurements()
      .subscribe();
  }
}
