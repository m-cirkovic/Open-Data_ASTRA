import { Injectable } from '@angular/core';
import {Site} from '../models/Internal/site.model';

@Injectable({
  providedIn: 'root'
})
export class ModalInfoService {

  savedSite: Site;

  constructor() { }

  saveInfo(s: Site): void {
    this.savedSite = s;
  }
  getSavedSite(): Site {
    return this.savedSite;
  }
}
