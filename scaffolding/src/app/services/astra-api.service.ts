import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Parser from 'fast-xml-parser'
import { iif, Observable, of } from 'rxjs';
import { catchError, concatAll, map, mergeMap, tap } from 'rxjs/operators';
import { SitePayloadPublication } from '../models/Soap/site.model';
import { SoapWrapper } from '../models/Soap/soap.model';
import { MeasurementCharacteristics, Lane, Site } from '../models/Internal/site.model';
import { MeasurementPayloadPublication } from '../models/Soap/measurement.model';
import { Measurements, Measurement, MeasurementData } from '../models/Internal/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class AstraApiService {

  private _auth = '57c5dbbbf1fe4d0001000018543da6f8789f4f868587d0de6163eccd';
  private _body$ = this._http.get('assets/SoapRequestBody.xml', { responseType: 'text' });
  private _errorMessageMap: Map<string, string>;

  private _measurements: Measurements;
  private _lanes: Lane[];
  private _staticLanes: Lane[];

  constructor(private _http: HttpClient) {
    this._http.get('assets/ErrorMessages.json').subscribe(msg => this._errorMessageMap = new Map(Object.entries(msg)));
  }


  public getStaticLanes(): Observable<Lane[]> {
    if (this._measurements) {
      return of(this._staticLanes);
    } else {
      return this._fetchStaticLanes();
    }
  }

  public getMeasurements(): Observable<Measurements> {
    if (this._measurements) {
      return of(this._measurements)
    } else {
      return this._fetchMeasurements();
    }
  }

  public getLanes(): Observable<Lane[]> {
    if (this._lanes) {
      return of(this._lanes);
    } else {
      return this._fetchLanes();
    }
  }

  public getNestedLanes(laneOptions?: { dynamic?: boolean }): Observable<Lane[]> {
    let data$: Observable<Lane[]> = laneOptions?.dynamic ? this.getLanes() : this.getStaticLanes();
    return this.getMeasurements().pipe(
      map(m => new Map<string, Measurement>(m.measurement.map(measurement => [measurement.siteId, measurement]))),
      map(m => data$.pipe(
        tap(site => site.forEach(s => s.measurements = m.get(s.siteId)))
      )),
      concatAll(),
      tap(s => this._lanes = s),
    )
  }

  public getSites(siteOptions?: { dynamic?: boolean }): Observable<Site[]> {
    return this.getNestedLanes(siteOptions).pipe(
      map(lanes => lanes.reduce(this._laneReducer, new Map<number, Lane[]>())),
      map(map => Array.from(map.entries())),
      map(k => k.map(s => new Site(s[0], s[1])))
    )
  }

  private _laneReducer(prev: Map<number, Lane[]>, curr: Lane): Map<number, Lane[]> {
    let i = prev.get(curr.specificLocation)
    if (i) {
      i.push(curr);
      prev.set(curr.specificLocation, i);
    } else {
      prev.set(curr.specificLocation, [curr]);
    }
    return prev;
  }

  private _fetchMeasurements(): Observable<Measurements> {
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
            }),
            new Date(ms.publicationTime['#text'])
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
            new Date(ms.publicationTime['#text']),
            this._errorMessageMap.get(v.measuredValue.basicData.vehicleFlow.reasonForDataError.values.value['#text'])
          )
        }
      }
      ))),
      tap(ms => this._measurements = ms),
    )
  }

  private _fetchStaticLanes(): Observable<Lane[]> {
    return this._http.get('assets/StaticMeasurementSites.xml', { responseType: 'text' }).pipe(
      this._mapLanes,
      tap(staticLanes => this._staticLanes = staticLanes)
    )
  }

  private _fetchLanes(): Observable<Lane[]> {
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
      this._mapLanes,
      tap(lanes => this._lanes = lanes)
    )
  }

  private _mapLanes(lanes: Observable<string>): Observable<Lane[]> {
    return lanes.pipe(
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(lanes => <SoapWrapper<SitePayloadPublication>>lanes),
      map(lanes => lanes.Envelope.Body.d2LogicalModel.payloadPublication.measurementSiteTable.measurementSiteRecord),
      map(lanes => lanes.map(site => new Lane(
        site['@_id'],
        site.measurementSiteLocation.alertCPoint?.alertCMethod4PrimaryPointLocation.alertCLocation.specificLocation['#text'],
        site.measurementSiteLocation.pointByCoordinates.pointCoordinates.longitude['#text'],
        site.measurementSiteLocation.pointByCoordinates.pointCoordinates.latitude['#text'],
        site.measurementSpecificCharacteristics.map(c => new MeasurementCharacteristics(
          c.measurementSpecificCharacteristics['@_index'],
          c.measurementSpecificCharacteristics.period['#text'],
          c.measurementSpecificCharacteristics.specificMeasurementValueType['#text'],
          c.measurementSpecificCharacteristics.specificVehicleCharacteristics.vehicleType['#text']
        ))
      ))),
    );
  }
}
