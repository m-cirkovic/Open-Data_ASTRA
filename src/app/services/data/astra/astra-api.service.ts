import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Parser from 'fast-xml-parser'
import { Observable, of } from 'rxjs';
import { catchError, concatAll, map, share, tap } from 'rxjs/operators';
import { SitePayloadPublication } from '../../../models/Soap/site.model';
import { SoapWrapper } from '../../../models/Soap/soap.model';
import { MeasurementCharacteristics, Lane, Site } from '../../../models/Internal/site.model';
import { BasicData, MeasuredValue, MeasurementPayloadPublication } from '../../../models/Soap/measurement.model';
import { Measurements, Measurement, MeasurementData } from '../../../models/Internal/measurement.model';
import { MeasurementIndexMapperService } from '../mappers/measurement-index-mapper.service';
import { ErrorMessageMapperService } from '../mappers/error-message-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class AstraApiService {

  private _auth = '57c5dbbbf1fe4d0001000018543da6f8789f4f868587d0de6163eccd';
  private _body$ = this._http.get('assets/SoapRequestBody.xml', { responseType: 'text' });

  constructor(
    private _http: HttpClient,
    private _indexMapper: MeasurementIndexMapperService,
    private _msgMapper: ErrorMessageMapperService
    ) {
  }

  public getStaticMeasurements(): Observable<Measurements> {
    return this._http.get('/assets/StaticMeasurements.xml', { responseType: 'text' }).pipe(
      map(r => this.mapToMeasurement(r, this._indexMapper, this._getMeasurementDataValue)),
      concatAll(),
      catchError((err,cau) => {console.log(err,cau); return of(err)}),
      share()
    )
  }

  public getMeasurements(): Observable<Measurements> {
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
      map(r => this.mapToMeasurement(r, this._indexMapper, this._getMeasurementDataValue)),
      concatAll(),
      catchError((err,cau) => {console.log(err,cau); return of(err)}),
      share()
    )

  }

  private mapToMeasurement(raw: string, indexMapper: MeasurementIndexMapperService, dataValue: (BasicData)=>number): Observable<Measurements>{
    return of(raw).pipe(
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(ms => <SoapWrapper<MeasurementPayloadPublication>>ms),
      map(ms => ms.Envelope.Body.d2LogicalModel.payloadPublication),
      map(ms => new Measurements(new Date(ms.publicationTime['#text']), ms.siteMeasurements.map(m => {
        if (m.measuredValue instanceof Array) {
          return new Measurement(
            m.measurementSiteReference['@_id'],
            new Date(ms.publicationTime['#text']),
            m.measuredValue.map(v => new MeasurementData(
              indexMapper.getVehicle(v['@_index']),
              indexMapper.getUnit(v['@_index']),
              dataValue(v.measuredValue.basicData)
            )
            )
          )
        } else {
          return new Measurement(
            m.measurementSiteReference['@_id'],
            new Date(ms.publicationTime['#text']),
            [
              new MeasurementData(
                this._indexMapper.getVehicle(m.measuredValue['@_index']),
                this._indexMapper.getUnit(m.measuredValue['@_index']),
                this._getMeasurementDataValue(m.measuredValue.measuredValue.basicData)
              )
            ],
            this._msgMapper.getMsg(m)
          )
        }
      }))),
    )
  }

  private _getMeasurementDataValue(basicData: BasicData): number {
    if (basicData.averageVehicleSpeed?.speed['#text']) {
      return basicData.averageVehicleSpeed?.speed['#text']
    } else {
      return basicData.vehicleFlow.vehicleFlowRate['#text']
    }
  }

  public getLanes(): Observable<Lane[]> {
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
      this._mapToLanes,
      share(),
    )
  }

  public getStaticLanes(): Observable<Lane[]> {
    return this._http.get('assets/StaticMeasurementSites.xml', { responseType: 'text' }).pipe(
      this._mapToLanes,
      share(),
    )
  }

  private _mapToLanes(lanes: Observable<string>): Observable<Lane[]> {
    return lanes.pipe(
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(lanes => <SoapWrapper<SitePayloadPublication>>lanes),
      map(lanes => lanes.Envelope.Body.d2LogicalModel.payloadPublication.measurementSiteTable.measurementSiteRecord),
      map(lanes => lanes.map(site => new Lane(
        site['@_id'],
        site.measurementSiteLocation.alertCPoint?.alertCMethod4PrimaryPointLocation.alertCLocation.specificLocation['#text'],
        site.measurementSiteLocation.pointByCoordinates?.pointCoordinates.longitude['#text'],
        site.measurementSiteLocation.pointByCoordinates?.pointCoordinates.latitude['#text'],
        site.measurementSpecificCharacteristics.map(c => new MeasurementCharacteristics(
          c.measurementSpecificCharacteristics['@_index'],
          c.measurementSpecificCharacteristics.period['#text'],
          c.measurementSpecificCharacteristics.specificMeasurementValueType['#text'],
          c.measurementSpecificCharacteristics.specificVehicleCharacteristics.vehicleType['#text']
        ))
      ))),
    );
  }

  private _maptoMeasuremnets(measurements: Observable<string>): Observable<Measurements> {
    return measurements.pipe(
      map(xml => Parser.parse(xml, { ignoreNameSpace: true, ignoreAttributes: false })),
      map(ms => <SoapWrapper<MeasurementPayloadPublication>>ms),
      map(ms => ms.Envelope.Body.d2LogicalModel.payloadPublication),
      map(ms => new Measurements(new Date(ms.publicationTime['#text']), ms.siteMeasurements.map(m => {
        if (m.measuredValue instanceof Array) {
          return new Measurement(
            m.measurementSiteReference['@_id'],
            new Date(ms.publicationTime['#text']),
            m.measuredValue.map(v => new MeasurementData(
              this._indexMapper.getVehicle(v['@_index']),
              this._indexMapper.getUnit(v['@_index']),
              this._getMeasurementDataValue(v.measuredValue.basicData)
            )
            )
          )
        } else {
          return new Measurement(
            m.measurementSiteReference['@_id'],
            new Date(ms.publicationTime['#text']),
            [
              new MeasurementData(
                this._indexMapper.getVehicle(m.measuredValue['@_index']),
                this._indexMapper.getUnit(m.measuredValue['@_index']),
                this._getMeasurementDataValue(m.measuredValue.measuredValue.basicData)
              )
            ],
            this._msgMapper.getMsg(m)
          )
        }
      }))),
    )
  }
}
