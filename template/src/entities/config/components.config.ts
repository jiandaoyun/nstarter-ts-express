//#module rabbitmq
import { RabbitMQConfig } from 'nstarter-rabbitmq';
//#endmodule rabbitmq

export interface IComponentsConf {
    //#module rabbitmq
    readonly rabbitmq: RabbitMQConfig;
    //#endmodule rabbitmq
    //#module grpc
    readonly grpc: {
        readonly server: {
            /**
             * 端口号
             * @maximum 65535
             * @minimum 1
             * @type integer
             */
            readonly port: number
        },
        readonly clients: {
            readonly package: string,
            readonly address: string
        }[]
    };
    //#endmodule grpc
}
