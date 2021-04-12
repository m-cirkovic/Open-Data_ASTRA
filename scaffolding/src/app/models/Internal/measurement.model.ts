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
        private _measurementData: MeasurementData[],
        private _publicationTime: Date,
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
}

export class MeasurementData{
    constructor(
        private _typeId: string,
        private _value: number,
        private _signifier: string,
    ){}

    get type(): string{
        return this._typeId;
    }

    get value(): number{
        return this._value;
    }

    get signifier(): string{
        return this._signifier;
    }
}