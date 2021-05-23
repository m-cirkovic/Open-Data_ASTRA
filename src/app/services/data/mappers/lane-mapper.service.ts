import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, map, tap } from 'rxjs/operators';
import { Measurement, Measurements } from '../../../models/Internal/measurement.model';
import { Lane, Site } from '../../../models/Internal/site.model';
import { TmcMapperService } from './tmc-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class LaneMapperService {


  constructor(private _tmcMapper:TmcMapperService){}

  public mapToSite(lanes: Observable<Lane[]> ): Observable<Site[]>{
    return lanes.pipe(
      map(lanes => lanes.reduce(LaneMapperService.laneReducer, new Map<number, Lane[]>())),
      map(map => Array.from(map.entries())),
      map(k => k.map(s => {
        if(!s[0]){
          console.log('err', s[0], s[1])
        }
        return new Site(s[0], s[1])
      }))
    )
  }

  public fillWithMeasurements(measurements: Observable<Measurements>, sites: Observable<Site[]>): Observable<Site[]>{
   return measurements.pipe(
    map(m => new Map<string, Measurement>(m.measurement.map(measurement => [measurement.siteId, measurement]))),
    map(m => sites.pipe(
      tap(site => site.forEach(s => s.lanes.map(l => l.measurements = m.get(l.siteId))))
    )),
    concatAll(),
   )
  }

  public static laneReducer(prev: Map<number, Lane[]>, curr: Lane): Map<number, Lane[]> {
    let lanes = prev.get(curr.specificLocation)
    if (lanes) {
      lanes.push(curr);
      prev.set(curr.specificLocation, lanes);
    } else {
      prev.set(curr.specificLocation, [curr]);
    }
    return prev;
  }


}
