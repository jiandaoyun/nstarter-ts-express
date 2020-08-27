//#module rabbitmq
import { RabbitMQConfig } from 'nstarter-rabbitmq';
//#endmodule rabbitmq
//#module mongodb
import { IMongodbConfig } from 'nstarter-mongodb';
//#endmodule mongodb
import { IBaseConf } from './base.config';

//#module redis
export interface IRedisConfig {
    readonly host: string;
    readonly port: number;
    readonly name: string;
    readonly password: string;
}
//#endmodule redis

export interface IDatabaseConf extends IBaseConf {
    //#module mongodb
    readonly mongodb: IMongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: IRedisConfig;
    //#endmodule redis
    //#module rabbitmq
    readonly rabbitmq: RabbitMQConfig;
    //#endmodule rabbitmq
}
