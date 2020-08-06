//#module rabbitmq
import { RabbitMQConfig } from 'nstarter-rabbitmq';
//#endmodule rabbitmq
import { IBaseConf } from './base.config';

//#module mongodb
interface IMongodbServer {
    readonly host: string;
    readonly port: number;
}

interface IX509Config {
    readonly ca: string;
    readonly cert: string;
    readonly key: string;
}

export interface IMongodbConfig {
    readonly servers: IMongodbServer[];
    readonly replicaSet?: string;
    readonly user?: string;
    readonly password?: string;
    readonly x509?: IX509Config;
    readonly db: string;
}

//#endmodule mongodb

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
