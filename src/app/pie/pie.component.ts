import {Component, OnDestroy, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Measurement, MeasurementData} from '../models/Internal/measurement.model';
import {TmcMapperService} from '../services/data/mappers/tmc-mapper.service';
import {AstraCacheService} from '../services/data/astra/astra-cache.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  private data = [
    {Framework: 'Vue', Stars: '166443', Released: '2014'},
    {Framework: 'React', Stars: '150793', Released: '2013'},
    {Framework: 'Angular', Stars: '62342', Released: '2016'},
    {Framework: 'Backbone', Stars: '27647', Released: '2010'},
    {Framework: 'Ember', Stars: '21471', Released: '2011'},
  ];
  private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  name: string;
  chartValues: MeasurementData[];
  site: Measurement;

  constructor(
    private _astraCache: AstraCacheService,
    private _tmcMapper: TmcMapperService
              ) { }

  ngOnInit(): void {
    this.chartValues = [];
    this.getData().then(l => {
      console.log(l);
      this.createSvg();
      this.createColors(l);
      this.drawChart(l);
    });
  }


  public getName(): string {
    return this._tmcMapper.getFirstName(this._astraCache.getSavedSpecificLocation());
  }

  private async getData(): Promise<MeasurementData[]> {
    const data = [];
    await this._astraCache.getLatestMeasurements().subscribe(res => {
      res.measurement.forEach(a => {
        if (a.siteId.localeCompare(this._astraCache.getSiteId()) === 0) {
          this.site = a;
          a.measurementData.forEach(l => {
              if ((l.unit.localeCompare('Fahrzeug/h') === 0) || (l.unit.localeCompare('Unbekannt') === 0)) {
                if (l.vehicleType.localeCompare('Leichtfahrzeuge') === 0) {
                  data.push(l);
                }
                if (l.vehicleType.localeCompare('Schwerverkehr') === 0) {
                  data.push(l);
                }/*
                if (l.vehicleType.localeCompare('Nicht Zugewiesen') === 0) {
                  data.push(l);
                }*/
              }
            }
          );
        }
      });
    });
    return data;
  }

  private createSvg(): void {
    this.svg = d3.select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(data): void {
    this.colors = d3.scaleOrdinal()
      .domain(data.map(d => d.value.toString()))
      .range(['#516aa0', '#c4714f', '#4a4c54']);
  }

  private drawChart(data): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(this.radius / 2) // da chani e donut mache
        .outerRadius(this.radius)
      )
      .attr('fill', (d, i) => (this.colors(i)))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text(d => d.data.vehicleType)
      .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }

}
