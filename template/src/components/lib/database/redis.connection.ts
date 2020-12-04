import _ from 'lodash';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import { Logger } from 'nstarter-core';
import { IRedisConfig } from '../../../entities/config/database.config';

export class RedisConnector {
    public readonly connection: Redis;
    private readonly _options: IRedisConfig;
    private readonly _name: string = '';

    constructor(options: IRedisConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }

        const o = _.defaults<RedisOptions, IRedisConfig>({
            retryStrategy: () => 1000
        }, this._options);
        this.connection = new IORedis(o);
        this.connection.on('error', (err) => {
            Logger.error(`${ this._tag } connection error`, { error: err });
        });
    }

    private get _tag(): string {
        return `Redis${ this._name ? `:${ this._name }` : '' }`;
    }
}
