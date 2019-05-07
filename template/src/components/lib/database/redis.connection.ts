import _ from 'lodash';
import ioredis, { Redis } from 'ioredis';
import { BaseConnection } from './base.connection';
import { RedisConfig } from '../../../config/database.config';
import { logger } from '../logger';

export class RedisConnector extends BaseConnection<RedisConfig, Redis> {
    constructor (options: RedisConfig) {
        super(options);

        const o = _.defaults({
            retryStrategy: () => 1000
        }, this._options);
        this.connection = new ioredis(o);
        this.connection.on('error', (err) => {
            logger.error(err);
        });
    }
}
