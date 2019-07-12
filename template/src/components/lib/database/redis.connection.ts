import _ from 'lodash';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import {RedisConfig} from '../../../config/database.config';
import { logger } from '../logger';

export class RedisConnector {
    private readonly _options: RedisConfig;
    private readonly _name: string = '';
    public readonly connection: Redis;

    constructor (options: RedisConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }

        const o = _.defaults<RedisOptions, RedisConfig>({
            retryStrategy: () => 1000
        }, this._options);
        this.connection = new IORedis(o);
        this.connection.on('error', (err) => {
            logger.error(`${ this._tag } connection error`, { error: err });
        });
    }

    private get _tag(): string {
        return `Redis${ this._name ? `:${ this._name }` : ''}`;
    }
}
