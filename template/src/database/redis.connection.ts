import _ from 'lodash';
import ioredis, { Redis } from 'ioredis';
import { BaseConnection } from './base.connection';
import { RedisConfig } from '../config/database.config';
import { logger } from '../logger';

export class RedisConnector extends BaseConnection<RedisConfig, Redis> {
    constructor (options: RedisConfig) {
        super(options);
    }

    public connect (callback: Function): void {
        const options = _.defaults({
            retryStrategy: () => 1000
        }, this._options);
        this.connection = new ioredis(options);
        this.connection.on('error', (err) => {
            logger.error(err);
        });
        return callback();
    }

    public disconnect (callback: Function): void {
        if (!this._connected) {
            return callback();
        }
        this.connection.removeAllListeners('error');
        this.connection.quit((err) => callback(err));
    }
}
