//#module mongodb
import { IMongodbConfig } from 'nstarter-mongodb';
//#endmodule mongodb

//#module redis
import { IRedisConfig } from 'nstarter-redis';
//#endmodule redis

export interface IStorageConf {
    //#module mongodb
    readonly mongodb: IMongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: IRedisConfig;
    //#endmodule redis
}
