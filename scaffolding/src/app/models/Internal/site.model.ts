import { thresholdSturges } from "d3-array";
import { Measurement } from "./measurement.model";

export class Site{


    private _measurements: Measurement;

    constructor(
        private _siteId: string,
        private _lng: number,
        private _lat: number,
        private _characteristics: MeasurementCharacteristics[]
    ) {}

    set measurements(m: Measurement){
        this._measurements = m;
    }

    get measurements(): Measurement {
        return this._measurements;
    }

    get siteId(): string{
        return this._siteId;
    }
    get lat(): number{
        return this._lat;
    }
    get lng(): number{
        return this._lng;
    }
    get characteristics(): MeasurementCharacteristics[]{
        return this._characteristics;
    }
}

export class MeasurementCharacteristics{
    constructor(
        private _typeId: string,
        private _period: number,
        private _vehicle: string,
        private _measurement: string,
    ){}


    get typeId(): string{
        return this._typeId;
    }

    get vehicle():string{
        return this._vehicle
    }

    get measurement(): string{
        return this._measurement;
    }

    get period(): number{
        return this._period;
    }
}