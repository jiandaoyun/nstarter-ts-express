import { MongodbConnector } from "./mongodb.connection";
import { RedisConnector } from "./redis.connection";
import { config } from "../config";

export class Database {
    private static _mongodb: MongodbConnector;
    private static _redis: RedisConnector;

    static get mongodb(): MongodbConnector {
        if (Database._mongodb) {
            return Database._mongodb;
        }
        const mongodb = new MongodbConnector(config.database.mongodb);
        mongodb.connect(() => {});
        Database._mongodb = mongodb;
        return mongodb;
    }

    static get redis(): RedisConnector {
        if (Database._redis) {
            return Database._redis;
        }
        const redis = new RedisConnector(config.database.redis);
        redis.connect(() => {});
        Database._redis = redis;
        return redis;
    }
}
