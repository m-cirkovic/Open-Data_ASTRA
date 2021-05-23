import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { circle, Control, DomUtil, Icon, Map, Marker, marker, popup, tooltip } from 'leaflet';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Site } from '../models/Internal/site.model';
import { AstraCacheService } from '../services/data/astra/astra-cache.service';

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


  fastest: { value: number, site: Site };
  slowest: { value: number, site: Site };
  mostVehicles: { value: number, site: Site };
  vehicleCount: number;
  measurementCount: number;
  siteCount: number;
  topTenFastest: { value: number, site: Site }[];


  filterConfig = {
    'normal': true,
    'fehlerhaft': true,
    'stau': true,
    'stockend': true,
  }

  constructor(private _astraCache: AstraCacheService) {

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
    this.mapChangeEvent$.pipe(tap(e => this.siteLayers = e)).subscribe(() => this.refreshValues())
    Icon.Default.imagePath = "assets/icons/"
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
    this.refreshValues()
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

  refreshValues() {
    this.onFilterClick()
    this.getFastest();
    this.getSlowest();
    this.getVehicleCount();
    this.getMostVehicles();
    this.getMeasurementCount();
    this.getSiteCount();
    this.getTopTenFastest();
  }
  getSiteCount() {
    this.siteCount = this._astraCache.getCurrentNested().length;
  }
  getMeasurementCount() {
    this.measurementCount = this._astraCache.getCurrentMeasurements()?.measurement?.length;
  }
  getMostVehicles() {
    let maxV = 0;
    let maxVSite: Site;
    this._astraCache.getCurrentNested().forEach(s =>
      s.lanes.forEach(l =>
        l.measurements?.measurementData?.forEach(d => {
          if (d.unit == 'Fahrzeug/h') {
            if (d.value > maxV) {
              maxV = d.value;
              maxVSite = s
            }
          }
        })
      )
    )

    this.mostVehicles = { value: Math.round(maxV), site: maxVSite };
  }
  getVehicleCount() {

  }
  getSlowest() {
    let min = 100000000;
    let minSite: Site;
    this._astraCache.getCurrentNested().forEach(s =>
      s.lanes.forEach(l =>
        l.measurements?.measurementData?.forEach(d => {
          if (d.unit == 'km/h') {
            if (d.value < min && d.value > 0 + 10e-2) {
              min = d.value;
              minSite = s
            }
          }
        })
      )
    )
    this.slowest = { value: Math.round(min), site: minSite };
  }

  getFastest() {
    let max = 0;
    let maxSite: Site;
    this._astraCache.getCurrentNested().forEach(s =>
      s.lanes.forEach(l =>
        l.measurements?.measurementData?.forEach(d => {
          if (d.unit == 'km/h') {
            if (d.value > max) {
              max = d.value;
              maxSite = s
            }
          }
        })
      )
    )

    this.fastest = { value: Math.round(max), site: maxSite };
  }

  getTopTenFastest() {
    let velocitySorted: number[] = []

    let fastestSortet = [];
    this._astraCache.getCurrentNested().forEach(s => {
      let hasLanesFasterThanZero = false;
      s.lanes.forEach(l => l.measurements?.measurementData?.forEach(d => {
        if (d.unit === 'km/h' && d.value > 0) {
          hasLanesFasterThanZero = true
          velocitySorted.push(d.value)
        }
      }))
      if (hasLanesFasterThanZero) {
        fastestSortet.push(s)
      }
    })
    fastestSortet = fastestSortet.sort(this._sortSiteByV)
    velocitySorted = velocitySorted.sort((a, b) => b - a);
    let topTenVFastest = velocitySorted.slice(0, 10);
    this.topTenFastest = topTenVFastest.map((v, i: number) => { return { value: Math.round(v), site: fastestSortet[i] } })

  }

  focusOn(site: Site){
    this.zoomTo(site)
    this.setMarker(site);
  }
  zoomTo(site: Site) {
    this.map.flyTo([site.lanes[0].lat, site.lanes[0].lng], this.map.getMaxZoom()-2, { duration: 2 })
  }

  setMarker(site: Site){
    let mk: Marker = marker([site.lanes[0].lat, site.lanes[0].lng]).addEventListener('mousedown', () => mk.removeFrom(this.map)).addTo(this.map);
  }

  markTopTen(focus: Site) {
    this.map.flyTo([focus.lanes[0].lat, focus.lanes[0].lng], this.map.getMinZoom(), { duration: 2 })
    let mk: Marker[] = this.topTenFastest.map(s => {
      return marker([s.site.lanes[0].lat, s.site.lanes[0].lng]).addEventListener('mousedown', () => mk.forEach(y => this.map.removeLayer(y))).addTo(this.map)
    })
  }

  private _sortSiteByV(a: Site, b: Site): number {

    let fastestA = 0;
    let fastestB = 0;
    a.lanes.forEach(l => l.measurements?.measurementData?.forEach(m => {
      if (m.unit === 'km/h' && fastestA < m.value) {
        fastestA = m.value;
      }
    }))
    b.lanes.forEach(l => l.measurements?.measurementData?.forEach(m => {
      if (m.unit === 'km/h' && fastestB < m.value) {
        fastestB = m.value;
      }
    }))
    return fastestB - fastestA;

  }
}
