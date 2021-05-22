import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Lane} from '../models/Internal/site.model';
import * as d3 from 'd3';


@Component({
  selector: 'app-line-simulator',
  templateUrl: './line-simulator.component.html',
  styleUrls: ['./line-simulator.component.css']
})
export class LineSimulatorComponent implements OnInit, AfterViewInit {

  private svg;
  private circle;
  @Input() lane: Lane;
  @ViewChild('lineSim') lineSim;

  private maxVelocity = 145;
  private animationDuration = 5000;
  private maxAnimationDuration = this.animationDuration + 500;
  


  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.repeat();
  }

  private createSvg(): void {
    this.svg = d3.select(this.lineSim.nativeElement)
      .attr('width', 700) // Set the attributes of the SVG element
      .attr('height', 50)
      .style('background-color', '#eee');
  }

  private pickUnit(carProbability: number): any {
    const randomVal = Math.random();
    if (randomVal <= carProbability) {
      return 'car';
    } else {
      return 'truck';
    }
  }

  private getDistribution(l: Lane): number {
    const car = this.getAmountCar(l);
    const truck = this.getAmountTruck(l);

    if ((car !== 0) && (truck !== 0)) {
      return car / (car + truck);
    }
    if ((car !== 0) && (truck === 0)) {
      return 1;
    } else {
      return 0;
    }
  }


  private getAmountCar(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Leichtfahrzeuge') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  private getAmountTruck(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Schwerverkehr') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  public getCarSpeed(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'km/h' && curr.vehicleType === 'Leichtfahrzeuge') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  public getTruckSpeed(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'km/h' && curr.vehicleType === 'Schwerverkehr') {
        acc = curr.value;
      }
      return Math.round(acc);
    }, 0);
  }

  private getSpeed(l: Lane, unit: string): number {
    if (unit === 'car') {
      return this.getCarSpeed(l);
    } else {
      return this.getTruckSpeed(l);
    }
  }

  private getDuration(speed: number): number {
    if(speed === 0) return 0;
    return this.maxAnimationDuration - ((speed / this.maxVelocity) * (this.animationDuration));
  }

  private createTruckCircle(): any {
    this.circle = this.svg.append('circle')
      .attr('cx', -25)
      .attr('cy', 25)
      .attr('r', 20)
      .attr('fill-opacity', '0.1')
      .style('fill', 'MidnightBlue')
      .style('stroke', 'blue')
      .style('stroke-width', '5px')
      .style('fill', 'blue');
  }

  private createCarCircle(): any {
    this.circle = this.svg.append('circle')
      .attr('cx', -25)
      .attr('cy', 25)
      .attr('r', 15)
      .attr('fill-opacity', '0.1')
      .style('fill', 'red')
      .style('stroke', 'orange')
      .style('stroke-width', '5px');
  }

  private chooseCircle(unit: string): void {
    if (unit === 'car') {
      this.createCarCircle();
    } else {
      this.createTruckCircle();
    }
  }

  private repeat(): void {
    const unit = this.pickUnit(this.getDistribution(this.lane))
    this.chooseCircle(unit);
    this.circle
      .attr('cx', -25)
      .attr('cy', 25)
      .transition()
      .duration(this.getDuration(this.getSpeed(this.lane, unit)))
      .attr('cx', 725)
      .transition()
      .duration(0)
      .attr('cx', -25);
    setTimeout(() => {
      this.repeat();
    }, this.getDuration(this.getSpeed(this.lane, unit)));
  }

}
