export interface ServerConfig {
    readonly http: {
        readonly port: number
    };
    //#module web
    readonly static: {
        readonly views: string,
        readonly public: string
    };
    readonly session: {
        readonly secret: string,
        readonly name: string
    };
    //#endmodule web
    readonly cookie: {
        readonly secret: string,
        readonly policy: {
            readonly httpOnly: boolean,
            readonly maxAge?: number,
            readonly signed: boolean,
            readonly secure: boolean,
            readonly domain?: string
        }
    };
}
