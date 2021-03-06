import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { circle, Control, DomUtil, Icon, Map as LMap, Marker, marker, popup, tooltip } from 'leaflet';
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
  @Input() map: LMap;
  @Input() mapChangeEvent$: Observable<Control.LayersObject>;

  sidebar: Control;
  loading = false;
  private _currentTab: string;


  fastest: { value: number, site: Site };
  slowest: { value: number, site: Site };
  mostVehicles: { value: number, site: Site };
  vehicleCount: number;
  siteCount: number;
  countOverSpeedLimit: number;
  topTenFastest: { value: number, site: Site }[];


  private _filterConfig = {
    'normal': true,
    'fehlerhaft': true,
    'stau': true,
    'stockend': true,
  }

  private _statSitesMarkers = new Map<number, Marker>();

  constructor(private _astraCache: AstraCacheService) {

  }

  ngOnInit(): void {
    const SideBar = Control.extend({
      onAdd(map: LMap) {
        return DomUtil.get('sidebar');
      },
      onRemove(map: LMap) { }
    });
    this.sidebar = new SideBar({
      position: 'topleft'
    }).addTo(this.map);
    this.mapChangeEvent$.pipe(tap(e => this.siteLayers = e)).subscribe(() => this._refreshValues())
    Icon.Default.imagePath = "assets/icons/"
  }

  ngAfterContentInit(): void {
    this._drawCircles()
    this._refreshValues()
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
      this._filterConfig[filterId] = !this._filterConfig[filterId];
      if (this._filterConfig[filterId]) {
        document.getElementById(filterId).classList.remove('filter-button-inactive')
      } else {
        document.getElementById(filterId).classList.add('filter-button-inactive')
      }
    }
    let siteLayerSeed = {};
    if (this._filterConfig.normal) {
      siteLayerSeed['normal'] = this.siteLayers.normal
    }
    if (this._filterConfig.stau) {
      siteLayerSeed['stau'] = this.siteLayers.stau
    }
    if (this._filterConfig.fehlerhaft) {
      siteLayerSeed['fehlerhaft'] = this.siteLayers.fehlerhaft
    }
    if (this._filterConfig.stockend) {
      siteLayerSeed['stockend'] = this.siteLayers.stockend
    }
    this.changeFilter.emit(siteLayerSeed)

  }

  

  getVehicleCount(): number {
    this.vehicleCount = this._getVehicleCount() / 60;
    return this.vehicleCount;
  }

  private _getVehicleCount() {
    return this._astraCache.currentMeasurments.measurement
      .reduce((acc, curr) =>
        curr.measurementData
          .reduce((accum, curr) => {
            if (curr.unit === 'Fahrzeug/h') {
              acc += curr.value;
            }
            return acc;
          }, 0)
        , 0)
  }

  getSiteCount() {
    this.siteCount = this._astraCache.getCurrentNested().length;
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

  private getCountOverSpeedLimit() {
    this.countOverSpeedLimit = this._astraCache.currentMeasurments.measurement.reduce((acc, curr) => acc += curr.measurementData.reduce((accum, current) => {
      if (current.unit === 'km/h' && current.value > 130) {
        accum++;
      }
      return accum;
    }, 0), 0)
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

  markTopTen() {
    this.topTenFastest.forEach(t => this.focusOn(t.site))
  }

  focusOn(site: Site) {
    this.flyTo(site)
    if (!this._statSitesMarkers.has(site.specificLocation)) {
      this.setMarker(site);
    }
  }

  flyTo(site: Site) {
    this.map.flyTo([site.lanes[0].lat, site.lanes[0].lng], this.map.getMinZoom(), { duration: 2 })
  }

  zoomTo(site: Site) {
    this.map.flyTo([site.lanes[0].lat, site.lanes[0].lng], this.map.getMaxZoom() - 2, { duration: 2 })
  }

  setMarker(site: Site) {
    let mk: Marker = marker([site.lanes[0].lat, site.lanes[0].lng])
      .addEventListener('mousedown', () => {
        mk.removeFrom(this.map);
        this._statSitesMarkers.delete(site.specificLocation)
      })
      .addTo(this.map);
    this._statSitesMarkers.set(site.specificLocation, mk);
  }

  clearAll() {
    Array.from(this._statSitesMarkers.values()).forEach(mk => this.map.removeLayer(mk))
    this._statSitesMarkers = new Map<number, Marker>()
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
  private _drawCircles() {
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
  }
  private _refreshValues() {
    this.onFilterClick()
    this.getFastest();
    this.getSlowest();
    this.getVehicleCount();
    this.getMostVehicles();
    this.getSiteCount();
    this.getCountOverSpeedLimit();
    this.getTopTenFastest();
  }
}
