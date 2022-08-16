import { BaseComponent, component } from 'nstarter-core';
import { IRedis, RedisConnector } from 'nstarter-redis';

import { config } from '../config';

@component()
export class RedisComponent extends BaseComponent {
    private readonly _redis: RedisConnector<IRedis>;

    constructor() {
        super();
        this._redis = new RedisConnector(config.storage.redis, this._name);
        this.redis.on('ready', () => {
            this.setReady(true);
        });
    }

    public get redis() {
        return this._redis.getClient();
    }

    public async shutdown() {
        this._redis.disconnect();
    }
}
