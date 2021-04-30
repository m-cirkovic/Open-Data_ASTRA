export interface TMC {
    cc: number;
    cid: number;
    versionNr: number;
    table: number;
    locationCode: number;
    type: string;
    roadNumber: string;
    roadName: string;
    junctionNumber: string;
    firstName: string;
    secondName: string;
    areaReference: string;
    linearReference: string;
    negativeOffset: string;
    positiveOffset: string;
    intersectionRefs: string;
    lat: number;
    lon: number;
    junctionCode: string;
    urban: string;
    interrupt: string;
    isolated: string;
    inPositive: string;
    outPositive: string;
    inNegative: string;
    outNegative: string;
    presentPositive: string;
    presentNegative: string;
    diversionPositive: string;
    diversionNegative: string;
}