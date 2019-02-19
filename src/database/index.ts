//#module mongodb
import { MongodbConnector } from './mongodb.connection';
//#endmodule mongodb
//#module redis
import { RedisConnector } from './redis.connection';
//#endmodule redis
import { config } from '../config';

export class Database {
    //#module mongodb
    private static _mongodb: MongodbConnector;
    //#endmodule mongodb
    //#module redis
    private static _redis: RedisConnector;
    //#endmodule redis

    //#module mongodb
    static get mongodb(): MongodbConnector {
        if (Database._mongodb) {
            return Database._mongodb;
        }
        const mongodb = new MongodbConnector(config.database.mongodb);
        mongodb.connect(() => {});
        Database._mongodb = mongodb;
        return mongodb;
    }
    //#endmodule mongodb

    //#module redis
    static get redis(): RedisConnector {
        if (Database._redis) {
            return Database._redis;
        }
        const redis = new RedisConnector(config.database.redis);
        redis.connect(() => {});
        Database._redis = redis;
        return redis;
    }
    //#endmodule redis
}
