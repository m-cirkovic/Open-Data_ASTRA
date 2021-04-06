export class Measurements{

    constructor(
        private _publicationDate: Date,
        private _measurements: Measurement[],
    ){}

    get publicationDate(): Date {
        return this._publicationDate
    }

    get Measurement(): Measurement[]{
        return this._measurements;
    }
}

export class Measurement{

    constructor(
        private _siteId: string,
        private _measurements: MeasurementData[],
        private _reasonForDataError?: string,
    ){}

    get siteId(): string{
        return this._siteId;
    }

    get measurements(): MeasurementData[]{
        return this._measurements;
    }

    get reasonForDataError(): string{
        return this._reasonForDataError;
    }
}

export class MeasurementData{
    constructor(
        private _typeId: string,
        private _value: number,
        private _signifier: number,
    ){}

    get type(): string{
        return this._typeId;
    }

    get value(): number{
        return this._value;
    }

    get signifier(): number{
        return this._signifier;
    }
}