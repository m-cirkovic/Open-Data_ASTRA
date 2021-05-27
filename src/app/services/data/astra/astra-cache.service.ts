
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
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

  private _staticMeasurements: Measurements;
  private _dynamicMeasurments: Measurements[] = [];

  private _staticSites: Site[];
  private _dynamicSites: Site[];

  private _site: Site;

  private _currentNested: Site[];
  private _currentMeasurementDate: Date;

  public currentMeasurments;

  constructor(
    private _astraApi: AstraApiService,
    private _laneMapper: LaneMapperService,
    private _tmcMapper: TmcMapperService
  ) { }


  /**
   * Call to optain the latest measurements
   * @returns latest Measurements which are nested in the sites.
   */
  public sitesWithLatestMeasurements(dynamic: boolean): Observable<Site[]> {
    return dynamic ? this._getDynamicNestedSites() : this._getStaticNestedSites();
  }

  private _getDynamicNestedSites(): Observable<Site[]> {
    return this._laneMapper.fillWithMeasurements(
      this.getDynamicMeasurements(),
      this._getDynamicSites(),
      this,
      this.setDynamicSites,
      this.setDynamicMeasurements
    )
  }

  private _getStaticNestedSites(): Observable<Site[]> {
    return this._laneMapper.fillWithMeasurements(this._getStaticMeasurements(), this._getStaticSites(), this, this.setStaticSites, this.setStaticMeasurements)
  }

  public setStaticSites(staticSites: Site[], thisArg: AstraCacheService) {
    thisArg._currentNested = staticSites;
    thisArg._staticSites = staticSites;
  }

  public setDynamicSites(dynamicSites: Site[], thisArg: AstraCacheService) {
    thisArg._currentNested = dynamicSites;
    thisArg._dynamicSites = dynamicSites;
  }

  public setStaticMeasurements(staticMeasurements: Measurements, thisArg: AstraCacheService) {
    thisArg.currentMeasurments = staticMeasurements;
    thisArg._currentMeasurementDate = staticMeasurements.publicationDate;
    thisArg._staticMeasurements = staticMeasurements;
  }
  public setDynamicMeasurements(dynamicMeasurements: Measurements, thisArg: AstraCacheService) {
    thisArg.currentMeasurments = dynamicMeasurements;
    thisArg._currentMeasurementDate = dynamicMeasurements.publicationDate;
    thisArg._dynamicMeasurments.push(dynamicMeasurements);
  }

  public getCurrentNested(): Site[] {
    return this._currentNested;
  }

  public getCurrentMeasurements(dynamic: boolean): Measurements {
    return dynamic ? this._staticMeasurements : this._dynamicMeasurments.slice(-1)[0];
  }

  public getMeasurementDate(dynamic: boolean): Date {
    return this._currentMeasurementDate;
  }

  public isMostCurrentDate(): boolean {
    return Date.now() - this._currentMeasurementDate.valueOf() < 1000 * 60;
  }

  private getDynamicMeasurements(): Observable<Measurements> {
    if (this._dynamicMeasurments.length > 0 && this.isMostCurrentDate()) {
      return of(this._dynamicMeasurments.slice(-1)[0])
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
    return this._astraApi.getStaticMeasurements().pipe(
      tap(a => this._staticMeasurements = a)
    )
  }

  private _fetchMeasurements(): Observable<Measurements> {
    return this._astraApi.getMeasurements().pipe(
      tap(m => this._dynamicMeasurments.push(m))
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
