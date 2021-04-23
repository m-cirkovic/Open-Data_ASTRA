import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { concat, Observable, of } from 'rxjs';
import { concatAll, map, tap } from 'rxjs/operators';
import { Measurements } from '../../../models/Internal/measurement.model';
import { Site } from '../../../models/Internal/site.model';
import { AstraApiService } from './astra-api.service';
import { LaneMapperService } from '../mappers/lane-mapper.service';
import { TmcMapperService } from '../mappers/tmc-mapper.service';

@Injectable({
  providedIn: 'root'
})
/**
 * This class caches all requests to the Astra Api and refreshes the data each Minute.
 */
export class AstraCacheService {


  private _latestMeasurments: Measurements;
  private _dynamicSites: Site[];
  private _staticSites: Site[];

  constructor(
    private _astraApi: AstraApiService,
    private _laneMapper: LaneMapperService,
    private _tmcMapper: TmcMapperService
  ) { }


  /**
   * Call to optain the latest measurements
   * @returns latest Measurements which are nested in the sites.
   */
  public sitesWithLatestMeasurements(siteOptions?: { dynamic: boolean }): Observable<Site[]> {
    let site$: Observable<Site[]> = siteOptions?.dynamic ? this._getDynamicSites() : this._getStaticSites();
    return this._laneMapper.fillWithMeasurements(this._getLatestMeasurements(), site$)
  }


  private _getLatestMeasurements(): Observable<Measurements> {
    if(this._latestMeasurments){
      return of(this._latestMeasurments)
    }else{
      return this._fetchMeasurements();
    }
  }

  private _getDynamicSites(): Observable<Site[]> {
    if (this._dynamicSites) {
      return of(this._dynamicSites)
    } else {
      return this._fetchDynamicSites();
    }
  }

  private _getStaticSites(): Observable<Site[]> {
    if (this._staticSites) {
      return of(this._staticSites)
    } else {
      return this._fetchStaticSites()
    }
  }

  private _fetchMeasurements(): Observable<Measurements> {
   return this._astraApi.getMeasurements().pipe(
      tap(m => this._latestMeasurments = m)
    )
  }

  private _fetchStaticSites(): Observable<Site[]> {
    return this._astraApi.getStaticLanes().pipe(
      map(s => this._laneMapper.mapToSite(of(s))),
      concatAll(),
      tap(sites => sites.forEach(s => s.locationName = this._tmcMapper.getFirstName(s.specificLocation))),
      tap(s => this._staticSites = s)
    )
  }

  private _fetchDynamicSites(): Observable<Site[]> {
    return this._astraApi.getLanes().pipe(
      map(s => this._laneMapper.mapToSite(of(s))),
      concatAll(),
      tap(s => this._dynamicSites = s)
    )
  }

}
