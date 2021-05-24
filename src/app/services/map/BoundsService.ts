import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class BoundsService {

  static getLatLngOnMap(lat, lng): { lat: number, lng: number } {
    if (lat < lng) {
      let temp = lng
      lng = lat 
      lat = temp
    }
    return { lat, lng }
  }
}
