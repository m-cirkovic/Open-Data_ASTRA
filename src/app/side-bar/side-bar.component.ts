import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';
import { LaneLayerService } from '../services/map/lane-layer.service';
import * as d3 from 'd3';
import { ThisReceiver } from '@angular/compiler';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, AfterContentInit {

  @Output() changeMap = new EventEmitter();
  @Output() changeFilter = new EventEmitter();

  @Input() siteLayers: L.Control.LayersObject;
  @Input() map: Map;
  @Input() mapChangeEvent$: Observable<Control.LayersObject>;

  sidebar: Control;
  dynamic = false;
  loading = false;
  private _currentTab: string;

  filterConfig = {
    'normal': true,
    'fehlerhaft': true,
    'stau': true,
    'stockend': true,
  }

  constructor(private _laneLayers: LaneLayerService) { 
    
  }

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
    this.mapChangeEvent$.pipe(tap(e => this.siteLayers = e)).subscribe(()=> this.onFilterClick())
  }

  ngAfterContentInit(): void {
    d3.select('#blueCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 20)
      .attr('fill-opacity', '0.2')
      .style('fill', 'MidnightBlue')
      .style('stroke', 'blue')
      .style('stroke-width', '5px')
      .style('fill', 'blue');

    d3.select('#orangeCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 20)
      .attr('fill-opacity', '0.2')
      .style('fill', 'MidnightBlue')
      .style('stroke', 'orange')
      .style('stroke-width', '5px')
      .style('fill', 'orange');

    d3.select('#redCircle')
      .append('svg')
      .attr('width', 50)
      .attr('height', 50)
      .append('circle')
      .attr('cx', 25)
      .attr('cy', 25)
      .attr('r', 20)
      .attr('fill-opacity', '0.2')
      .style('fill', 'MidnightBlue')
      .style('stroke', 'red')
      .style('stroke-width', '5px')
      .style('fill', 'red');

    this.onFilterClick();
  }

  hidePane(): void {
    document.getElementById(this._currentTab).style.display = 'none';
    this._currentTab = '';
  }

  changeTab(tab: string): void {
    const current = document.getElementById(this._currentTab);
    if (current) {
      current.style.display = 'none';
    }
    if (tab !== this._currentTab) {
      document.getElementById(tab).style.display = 'block';
      this._currentTab = tab;
    } else {
      this._currentTab = null;
    }
  }

  onMapClick(event: string) {
    this.changeMap.emit(event);
  }

  onFilterClick(filterId?: string) {
    if (filterId) {
      this.filterConfig[filterId] = !this.filterConfig[filterId];
      if (this.filterConfig[filterId]) {
        document.getElementById(filterId).classList.remove('filter-button-inactive')
      } else {
        document.getElementById(filterId).classList.add('filter-button-inactive')
      }
    }
    let siteLayerSeed = {};
    if (this.filterConfig.normal) {
      siteLayerSeed['normal'] = this.siteLayers.normal
    }
    if (this.filterConfig.stau) {
      siteLayerSeed['stau'] = this.siteLayers.stau
    }
    if (this.filterConfig.fehlerhaft) {
      siteLayerSeed['fehlerhaft'] = this.siteLayers.fehlerhaft
    }
    if (this.filterConfig.stockend) {
      siteLayerSeed['stockend'] = this.siteLayers.stockend
    }
    this.changeFilter.emit(siteLayerSeed)

  }

}
