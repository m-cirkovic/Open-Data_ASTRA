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

  private maxVelocity = 135;
  private animationDuration = 5000;
  private maxAnimationDuration = this.animationDuration + 100;
  private maxDensity = 3500;


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
      .attr('width', 702) // Set the attributes of the SVG element
      .attr('height', 40)
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

  private getSpeedDuration(speed: number): number {
    if (speed === 0) {
      return 0;
    }
    return this.maxAnimationDuration - ((speed / this.maxVelocity) * (this.animationDuration));
  }

  private createTruck(): any {
    this.circle = this.svg.append('image')
      .attr('xlink:href', 'assets/images/Sinnbild_LKW.svg.png' )
      .attr('x', -30)
      .attr('y', 10)
      .attr('height', 30);
  }

  private createCar(): any {
    this.circle = this.svg.append('image')
      .attr('xlink:href', 'assets/images/Car_pictogram.svg.png' )
      .attr('x', -30)
      .attr('y', 17)
      .attr('height', 25);
  }

  private chooseCircle(unit: string): void {
    if (unit === 'car') {
      this.createCar();
    } else {
      this.createTruck();
    }
  }

  private getTrafficDensity(l: Lane): number {
    return l.measurements.measurementData.reduce((acc, curr) => {
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Schwerverkehr') {
        acc += curr.value;
      }
      if (curr.unit === 'Fahrzeug/h' && curr.vehicleType === 'Leichtfahrzeuge') {
        acc += curr.value;
      }
      return acc;
    }, 0);
  }

  private getTraffic(density: number): number {
    if (density === 0) {
      return 0;
    }
    return this.maxAnimationDuration - ((density / this.maxDensity) * (this.animationDuration));
  }

  private repeat(): void {
    const unit = this.pickUnit(this.getDistribution(this.lane));
    this.chooseCircle(unit);
    this.circle
      .transition()
      .duration(this.getSpeedDuration(this.getSpeed(this.lane, unit)))
      .ease(d3.easeLinear)
      .attr('x', 725);
    setTimeout(() => {
      this.repeat();
    }, this.getTraffic(this.getTrafficDensity(this.lane))/2);
  }

}
