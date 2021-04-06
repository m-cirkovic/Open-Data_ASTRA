import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Parser from 'fast-xml-parser'
import { Observable } from 'rxjs';
import { concatAll, map, tap } from 'rxjs/operators';
import { SitePayloadPublication } from '../models/Soap/site.model';
import { SoapWrapper } from '../models/Soap/soap.model';
import { MeasurementCharacteristics, Site } from '../models/Internal/site.model';
import { MeasurementPayloadPublication, MeasuredValue, Value, BasicData } from '../models/Soap/measurement.model';
import { Measurements, Measurement, MeasurementData } from '../models/Internal/measurement.model';
@Injectable({
  providedIn: 'root'
})
export class AstraApiService {

  private _auth = '57c5dbbbf1fe4d0001000018543da6f8789f4f868587d0de6163eccd';
  private _body$ = this._http.get('assets/SoapRequestBody.xml', { responseType: 'text' });

  constructor(private _http: HttpClient) {
    
  }


  public getMeasurements(): Observable<any> {
    return this._body$.pipe(
      map(body => this._http.post('/api', body, {
        responseType: 'text',
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Authorization', this._auth)
          .append('SOAPAction', 'http://opentransportdata.swiss/TDP/Soap_Datex2/Pull/v1/pullMeasuredData')
      })
      ),
      concatAll(),
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(ms => <SoapWrapper<MeasurementPayloadPublication>>ms),
      map(ms => ms.Envelope.Body.d2LogicalModel.payloadPublication),
      map(ms => new Measurements(new Date(ms.publicationTime['#text']), ms.siteMeasurements.map(m => {
        if (m.measuredValue instanceof Array) {
          return new Measurement(
            m.measurementSiteReference['@_id'],
            m.measuredValue.map(v => {
              let speed = v.measuredValue.basicData.averageVehicleSpeed?.speed['#text'];
              if (speed) {
                return new MeasurementData(
                  v['@_type'],
                  speed,
                  v.measuredValue.basicData.averageVehicleSpeed.speed['@_type']
                )
              } else {
                return new MeasurementData(
                  v['@_type'],
                  v.measuredValue.basicData.vehicleFlow.vehicleFlowRate['#text'],
                  v.measuredValue.basicData.vehicleFlow.vehicleFlowRate['@_type']
                )
              }
            })
          )
        } else {
          const v = m.measuredValue;
          return new Measurement(
            m.measurementSiteReference['@_id'],
            [new MeasurementData(
              v['@_type'],
              v.measuredValue.basicData.vehicleFlow.vehicleFlowRate['#text'],
              v.measuredValue.basicData.vehicleFlow.vehicleFlowRate['@_type']
            )],
            v.measuredValue.basicData.vehicleFlow.reasonForDataError.values.value['#text']
          )
        }
      }
      ))),
      tap(console.log)
    )
  }

  public getSites() {
    return this._body$.pipe(
      map(body => this._http.post('/api', body, {
        responseType: 'text',
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Authorization', this._auth)
          .append('SOAPAction', 'http://opentransportdata.swiss/TDP/Soap_Datex2/Pull/v1/pullMeasurementSiteTable')
      })
      ),
      concatAll(),
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(sites => <SoapWrapper<SitePayloadPublication>>sites),
      map(sites => sites.Envelope.Body.d2LogicalModel.payloadPublication.measurementSiteTable.measurementSiteRecord),
      map(sites => sites.map(site => new Site(
        site['@_id'],
        site.measurementSiteLocation.pointByCoordinates.pointCoordinates.longitude['#text'],
        site.measurementSiteLocation.pointByCoordinates.pointCoordinates.latitude['#text'],
        site.measurementSpecificCharacteristics.map(c => new MeasurementCharacteristics(
          c.measurementSpecificCharacteristics.period['#text'],
          c.measurementSpecificCharacteristics.specificMeasurementValueType['#text'],
          c.measurementSpecificCharacteristics.specificVehicleCharacteristics.vehicleType['#text']
        ))
      ))),
      tap(console.log),
    )
  }
}
