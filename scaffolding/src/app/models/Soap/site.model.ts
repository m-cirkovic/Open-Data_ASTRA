export interface SitePayloadPublication {
    measurementSiteTable: MeasurementSiteTable;
}

export interface MeasurementSiteTable {
    measurementSiteRecord: MeasurementSiteRecord[];
}

export interface MeasurementSiteRecord {
    '@_id': string;
    measurementSiteLocation: MeasurementSiteLocation;
    measurementSiteNumberOfLanes: MeasurementSiteNumberOfLanes;
    measurementSpecificCharacteristics: MeasurementSpecificCharacteristicsWrapper[];
}

export interface MeasurementSiteLocation {
    alertCPoint: AlertCPoint;
    pointByCoordinates: PointByCoordinates;
    supplementaryPositionalDescription: SupplementaryPositionalDescription;
}

export interface AlertCPoint {
    //can be implemented if information is needed
}

export interface PointByCoordinates {
    pointCoordinates: PointCoordinates;
}

export interface PointCoordinates {
    latitude: Latitude;
    longitude: Longitude;
}

export interface Latitude {
    ['#text']: number;
}

export interface Longitude {
    ['#text']: number
}

export interface SupplementaryPositionalDescription {
    //can be implemented if information is needed
}

export interface MeasurementSiteNumberOfLanes {
    //can be implemented if information is needed
}

export interface MeasurementSpecificCharacteristicsWrapper {
   measurementSpecificCharacteristics: MeasurementSpecificCharacteristics;
}

export interface MeasurementSpecificCharacteristics{
    ['@_index']:string;
    period: Period;
    specificMeasurementValueType: SpecificMeasurementValueType;
    specificVehicleCharacteristics: SpecificVehicleCharacteristics;
}

export interface SpecificVehicleCharacteristics{
    vehicleType: VehicleType;
}

export interface VehicleType{
    '#text':string
}

export interface SpecificMeasurementValueType{
    '#text': string
}

export interface Period{
    '#text': number
}