import { IBaseConf } from './base.config';
//#module rabbitmq
import { RabbitMQConfig } from 'nstarter-rabbitmq';
//#endmodule rabbitmq

export interface IComponentsConf extends IBaseConf {
    //#module rabbitmq
    readonly rabbitmq: RabbitMQConfig;
    //#endmodule rabbitmq
    //#module grpc
    grpc: {
        readonly server: {
            readonly port: number
        },
        readonly clients: {
            readonly package: string,
            readonly address: string
        }[]
    };
    //#endmodule grpc
}
