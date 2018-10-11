import { MongodbConnector } from "./mongodb.connection";
import { RedisConnector } from "./redis.connection";

let mongodb: MongodbConnector,
    redis: RedisConnector;

export class Database {
    static get mongodb(): MongodbConnector {
        if (mongodb) {
            return mongodb;
        }
        mongodb = new MongodbConnector({
            mongod: {
                host: 'localhost',
                port: 27017
            },
            user: 'admin',
            password: '!passw0rd'
        });
        mongodb.connect(() => {});
        return mongodb;
    }

    static get redis(): RedisConnector {
        if (redis) {
            return redis;
        }
        redis = new RedisConnector({
            name: 'redis',
            host: 'localhost',
            port: 6379,
            password: '!passw0rd'
        });
        redis.connect(() => {});
        return redis;
    }
}
