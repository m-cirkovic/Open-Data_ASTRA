import { ThisReceiver } from "@angular/compiler";
import { Measurement } from "./measurement.model";

export class Site {


    public locationName: string;

    constructor(
        private _specificLocation: number,
        private _lanes: Lane[]
    ) { }

    get specificLocation(): number {
        return this._specificLocation;
    }

    get lanes() {
        return this._lanes;
    }

}

export class Lane {

    measurements: Measurement;
    private _lat: number;
    private _lng: number;

    constructor(
        private _siteId: string,
        private _specificLocation: number,
        private _latLng: {lat:number, lng:number}
    ) {
        this._lat = _latLng.lat
        this._lng = _latLng.lng;

    }

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