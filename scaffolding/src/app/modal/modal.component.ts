import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ModalInfoService} from '../services/modal-info.service';
import {Site} from '../models/Internal/site.model';
import {Measurement, MeasurementData} from '../models/Internal/measurement.model';
import {AstraCacheService} from '../services/data/astra/astra-cache.service';
import {TmcMapperService} from '../services/data/mappers/tmc-mapper.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _astraCache: AstraCacheService,
    private _tmcMapper: TmcMapperService) {
  }

  ngOnInit(): void {
   this.name = this.getName();
  }

  public getName(): string {
    return this._tmcMapper.getFirstName(this._astraCache.getSavedSpecificLocation());
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

}
