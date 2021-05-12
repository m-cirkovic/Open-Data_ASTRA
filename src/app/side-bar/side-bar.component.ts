import { ThisReceiver } from '@angular/compiler';
import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';
import { LaneLayerService } from '../services/map/lane-layer.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, AfterContentInit {

  @Output() updateData = new EventEmitter();
  @Input() map: Map;
  sidebar: Control;
  dynamic = false;
  loading = false;
  private _currentTab: string;

  constructor(private _laneLayers: LaneLayerService) { }

  ngOnInit(): void {
    const SideBar = Control.extend({
      onAdd(map: Map) {
        return DomUtil.get('sidebar');
      },
      onRemove(map: Map) { }
    });
    this.sidebar = new SideBar({
      position: 'topleft'
    }).addTo(this.map);
  }

  ngAfterContentInit(): void {
    d3.select('#blueCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 25)
      .style('fill', 'blue');

    d3.select('#orangeCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 25)
      .style('fill', 'orange');

    d3.select('#redCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 25)
      .style('fill', 'red');
  }

  hidePane(): void {
    document.getElementById(this._currentTab).style.display = 'none';
    this._currentTab = '';
  }

  changeTab(tab: string): void {
    const current = document.getElementById(this._currentTab);
    if (current){
      current.style.display = 'none';
    }
    if (tab !== this._currentTab){
      document.getElementById(tab).style.display = 'block';
      this._currentTab = tab;
    }else{
      this._currentTab = null;
    }
  }

  changeData(): void {
    this.loading = true;
    this.dynamic = !this.dynamic;
    this._laneLayers.getAllLayers({dynamic: this.dynamic}).subscribe(layers => {
      this.updateData.emit(layers);
      this.loading = false;
    });
  }

}
