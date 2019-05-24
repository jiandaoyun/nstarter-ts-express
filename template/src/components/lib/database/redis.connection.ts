import _ from 'lodash';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import {RedisConfig} from '../../../config/database.config';
import { logger } from '../logger';

export class RedisConnector {
    private readonly _options: RedisConfig;
    public connection: Redis;

    constructor (options: RedisConfig) {
        this._options = options;

        const o = _.defaults<RedisOptions, RedisConfig>({
            retryStrategy: () => 1000
        }, this._options);
        this.connection = new IORedis(o);
        this.connection.on('error', (err) => {
            logger.error(err);
        });
    }
}
