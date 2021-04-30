import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SplashScreenStateService} from '../services/splash-screen-state.service';
import {MarkerService} from '../services/marker.service';

@Injectable({
  providedIn: 'root'
})
export class MapResolver implements Resolve<boolean> {
  constructor(
    private markerService: MarkerService,
    private splashScreenStateService: SplashScreenStateService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return new Promise((resolve, reject) => {
      this.markerService.makeLayers();
      setTimeout(() => {
        this.splashScreenStateService.stop();
        resolve(of(['lol']));
      }, 5000);
    });
  }
}
