export interface SoapWrapper<T>{
    Envelope: Envelope<T>
}

export interface Envelope<T>{
    Body: Body<T>
}

export interface Body<T>{
    d2LogicalModel: D2LogicalModel<T>
}

export interface D2LogicalModel<T>{
    payloadPublication: T
}