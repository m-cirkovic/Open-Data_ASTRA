import { Measurement } from "./measurement.model";

export class Site {

    
    constructor(
        private _specificLocation: number,
        private _lanes: Lane[]
    ) { }

    get specificLocation(): number{
        return this._specificLocation;
    }

    get lanes(){
        return this._lanes;
    }

}

export class Lane {

    measurements: Measurement;

    constructor(
        private _siteId: string,
        private _specificLocation: number,
        private _lng: number,
        private _lat: number,
        private _characteristics: MeasurementCharacteristics[]
    ) { }

    get siteId(): string {
        return this._siteId;
    }
    get specificLocation(): number {
        return this._specificLocation;
    }
    get lat(): number {
        return this._lat;
    }
    get lng(): number {
        return this._lng;
    }
    get characteristics(): MeasurementCharacteristics[] {
        return this._characteristics;
    }
}

export class MeasurementCharacteristics {
    constructor(
        private _typeId: string,
        private _period: number,
        private _vehicle: string,
        private _measurement: string,
    ) { }


    get typeId(): string {
        return this._typeId;
    }

    get vehicle(): string {
        return this._vehicle
    }

    get measurement(): string {
        return this._measurement;
    }

    get period(): number {
        return this._period;
    }
}