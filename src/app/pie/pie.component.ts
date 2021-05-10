import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Lane } from '../models/Internal/site.model';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit, AfterViewInit {

  private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  @Input() lane: Lane;
  @ViewChild("pie") pie;

  constructor() { }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3.select(this.pie.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.lane.measurements.measurementData.map(d => d.value.toString()))
      .range(['#516aa0', '#c4714f', '#4a4c54']);
  }


  private drawChart(): void {

    let data = this.lane.measurements.measurementData.filter(d => d.unit === 'Fahrzeug/h');
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
      .style('stroke-width', '1px')


    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text(d => `${d.data.vehicleType} (${d.data.value})`)
      .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15);


  }



}
