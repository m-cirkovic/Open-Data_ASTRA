import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalInfoService } from '../services/modal-info.service';
import { Lane, Site } from '../models/Internal/site.model';
import { Measurement, MeasurementData } from '../models/Internal/measurement.model';
import { AstraCacheService } from '../services/data/astra/astra-cache.service';
import { TmcMapperService } from '../services/data/mappers/tmc-mapper.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  name: string;
  site: Site;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _astraCache: AstraCacheService,
    private _tmcMapper: TmcMapperService) {
  }

  ngOnInit(): void {
    this.name = this.getName();
    this.site = this._astraCache.getSite();
  }

  public getName(): string {
    return this._tmcMapper.getFirstName(this._astraCache.getSavedSpecificLocation());
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
  
  public getDesignation(l: Lane): string {
    return `Spur ${Number.parseInt(l.siteId.split('.').pop(), 10)}`;
  }

  public getCarSpeed(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'km/h' && curr.vehicleType === 'Leichtfahrzeuge') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  public getLorrySpeed(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'km/h' && curr.vehicleType === 'Schwerverkehr') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  public getLorryAmount(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Schwerverkehr') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  public getCarAmount(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Leichtfahrzeuge') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

}
