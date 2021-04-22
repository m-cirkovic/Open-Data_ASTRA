export class Measurements{

    constructor(
        private _publicationDate: Date,
        private _measurements: Measurement[],
    ){}

    get publicationDate(): Date {
        return this._publicationDate
    }

    get measurement(): Measurement[]{
        return this._measurements;
    }
}

export class Measurement{

    constructor(
        private _siteId: string,
        private _publicationTime: Date,
        private _measurementData: MeasurementData[],
        private _reasonForDataError?: string,
    ){}

    get siteId(): string{
        return this._siteId;
    }

    get measurementData(): MeasurementData[]{
        return this._measurementData;
    }

    get reasonForDataError(): string{
        return this._reasonForDataError;
    }

    get publicationTime():Date{
        return this._publicationTime;
    }

    get summarizedMeasurements(){
        //TODO: CachService (Datenverwaltungsklasse), LaneMapper, SiteMapper, Sitedrawer, D3 einbinden
        return "";
    }
}

export class MeasurementData{
    constructor(
        private _vehicleType: string,
        private _unit: string,
        private _value: number
    ){}

    get vehicleType(): string{
        return this._vehicleType;
    }

    get unit(): string{
        return this._unit;
    }

    get value(): number{
        return this._value;
    }

    
}