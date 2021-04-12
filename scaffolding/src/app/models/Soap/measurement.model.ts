
export interface MeasurementPayloadPublication {
    publicationTime: AstraTime;
    siteMeasurements: SiteMeasurements[];
}

export interface SiteMeasurements {
    measuredValue: MeasuredValue | MeasuredValue[];
    measurementSiteReference: MeasurementSiteReference;
}
/**
 * The ASTRA API returns the following structure, which is why this type declaration is made to be flexible. (example is in JSON instead of xml and shortened for readability)
 * @example 
 * measuredValue: [
        {
            "measuredValue": {
                "basicData": {
                    "vehicleFlow": {
                        "vehicleFlowRate": {
                            "#text": 1680
                        }
                    }
                }
            }
        }
    ]
 */
export interface MeasuredValue {
    '@_type': string
    measuredValue?: MeasuredValue;
    basicData?: BasicData;
    measurementTimeDefault: AstraTime;
}

export interface BasicData {
    vehicleFlow?: VehicleFlow;
    averageVehicleSpeed?: AverageVehicleSpeed;
}

export interface AverageVehicleSpeed {
    speed: Speed;
}

export interface Speed {
    ['@_type']: string;
    ['#text']: number;
}

export interface VehicleFlow {
    vehicleFlowRate: VehicleFlowRate;
    dataError: DataError;
    reasonForDataError: ReasonForDataError;
}

export interface DataError {
    '#text': boolean;
}

export interface ReasonForDataError {
    values: ValueWrapper;
}

export interface ValueWrapper{
    value: Value;
}

export interface Value{
    '#text': string;
}

export interface VehicleFlowRate {
    '#text': number;
    ['@_type']: string;
}

export interface MeasurementSiteReference {
    '@_id': string
}

export interface AstraTime {
    '#text': string;
}
