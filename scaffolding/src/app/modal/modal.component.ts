import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ModalInfoService} from '../services/modal-info.service';
import {Site} from '../models/Internal/site.model';
import {Measurement} from '../models/Internal/measurement.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  infobox: Site;
  station: any;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public modalInfoService: ModalInfoService) { }

  ngOnInit(): void {
    this.infobox = this.modalInfoService.getSavedSite();
    console.log(this.getMeasurement(this.infobox));
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  printInput(): void{
    console.log('stupid boy');
  }

  getMeasurement(data: any): void {
    this.station = data.specificLocation;
    data.lanes.forEach(e => {
      console.log(e.measurements._siteId);
    });
  }
}
