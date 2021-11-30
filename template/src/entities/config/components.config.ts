//#module rabbitmq
import { RabbitMQConfig } from 'nstarter-rabbitmq';
//#endmodule rabbitmq

//#module grpc_client
interface IGrpcClient {
    readonly enable: boolean;
    readonly package: string;
    readonly address: string;
    readonly useSsl: boolean;
    readonly servername?: string;
}
//#endmodule grpc_client

export interface IComponentsConf {
    //#module rabbitmq
    readonly rabbitmq: RabbitMQConfig;
    //#endmodule rabbitmq
    //#module grpc_server|grpc_client
    readonly grpc: {
        //#module grpc_server
        readonly server: {
            /**
             * 端口号
             * @maximum 65535
             * @minimum 1
             * @type integer
             */
            readonly port: number
        },
        //#endmodule grpc_server
        //#module grpc_client
        readonly clients: IGrpcClient[]
        //#endmodule grpc_client
    };
    //#endmodule grpc_server|grpc_client
}
