
import { Injectable } from '@angular/core';
import {  Observable, of, Subject } from 'rxjs';
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
  private _staticMeasurements: Measurements;
  private _dynamicSites: Site[];
  private _staticSites: Site[];
  private _site: Site;
  private _currentMeasurementDate: Date;

  constructor(
    private _astraApi: AstraApiService,
    private _laneMapper: LaneMapperService,
    private _tmcMapper: TmcMapperService
  ) { }


  /**
   * Call to optain the latest measurements
   * @returns latest Measurements which are nested in the sites.
   */
  public sitesWithLatestMeasurements(siteOptions?: { dynamicSites?: boolean, dynamicMeasurements?: boolean }): Observable<Site[]> {
    let site$: Observable<Site[]> = siteOptions?.dynamicSites ? this._getDynamicSites() : this._getStaticSites();
    let measurement$: Observable<Measurements> = siteOptions?.dynamicSites ? this.getLatestMeasurements() : this._getStaticMeasurements();
    return this._laneMapper.fillWithMeasurements(measurement$, site$).pipe(tap(s => this._currentMeasurementDate = s[0].lanes[0].measurements.publicationTime))
  }

  public getMeasurementDate(): Date{
    return this._currentMeasurementDate;
  }

  private getLatestMeasurements(): Observable<Measurements> {
    if (this._latestMeasurments) {
      return of(this._latestMeasurments)
    } else {
      return this._fetchMeasurements();
    }
  }

  private _getStaticMeasurements() {
    if (this._staticMeasurements) {
      return of(this._staticMeasurements)
    } else {
      return this._fetchStaticMeasurements();
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

  private _fetchStaticMeasurements(): Observable<Measurements> {
    if(this._staticMeasurements){
      return of(this._staticMeasurements)
    }
    return this._astraApi.getStaticMeasurements().pipe(
      tap(a => this._staticMeasurements = a)
    )
  }

  private _fetchMeasurements(): Observable<Measurements> {
    if(this._latestMeasurments){
      return of(this._latestMeasurments)
    }
    return this._astraApi.getMeasurements().pipe(
      tap(m => this._latestMeasurments = m)
    )
  }

  private _fetchStaticSites(): Observable<Site[]> {
    if(this._staticSites){
      return of(this._staticSites)
    }
    return this._astraApi.getStaticLanes().pipe(
      map(s => this._laneMapper.mapToSite(of(s))),
      concatAll(),
      tap(sites => sites.forEach(s => s.locationName = this._tmcMapper.getFirstName(s.specificLocation))),
      tap(s => this._staticSites = s)
    )
  }

  private _fetchDynamicSites(): Observable<Site[]> {
    if(this._dynamicSites){
      return of(this._dynamicSites)
    }
    return this._astraApi.getLanes().pipe(
      map(s => this._laneMapper.mapToSite(of(s))),
      concatAll(),
      tap(sites => sites.forEach(s => s.locationName = this._tmcMapper.getFirstName(s.specificLocation))),
      tap(s => this._dynamicSites = s)
    );
  }

  public saveSite(site: Site): void {
    this._site = site;
  }

  public getSavedSpecificLocation(): number {
    return this._site.specificLocation;
  }

  public getSite(): Site {
    return this._site;
  }

}
