export interface ServiceOptions {
    readonly enabled: true;
}

export interface ServiceConfig {
    readonly http: ServiceOptions,
    readonly mongodb: ServiceOptions,
    readonly redis: ServiceOptions,
    readonly websocket: ServiceOptions
}
