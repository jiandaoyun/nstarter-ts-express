export interface ComponentsConfig {
    //#module grpc
    grpc: {
        readonly server: {
            readonly enabled: boolean,
            readonly port: number
        };
        readonly clients: {
            readonly package: string,
            readonly address: string
        }[];
    };
    //#endmodule grpc
}
