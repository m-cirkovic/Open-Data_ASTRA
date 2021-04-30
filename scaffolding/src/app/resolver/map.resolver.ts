import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { LayerGroup } from 'leaflet';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LaneLayerService } from '../services/map/lane-layer.service';
import { SplashScreenStateService } from '../services/splash-screen-state.service';

@Injectable({
  providedIn: 'root'
})
export class MapResolver implements Resolve<LayerGroup> {
  
  constructor(
    private splashScreenStateService: SplashScreenStateService,
    private layerService: LaneLayerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LayerGroup> {
    return this.layerService.getAll().pipe(tap(() => this.splashScreenStateService.stop));

  }
}
