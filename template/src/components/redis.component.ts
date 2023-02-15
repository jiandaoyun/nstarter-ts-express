import { BaseComponent, component, Logger } from 'nstarter-core';
import { RedisConnector } from 'nstarter-redis';

import { config } from '../config';

@component()
export class RedisComponent extends BaseComponent {
    private readonly _redis: RedisConnector;

    constructor() {
        super();
        this._redis = new RedisConnector(config.storage.redis);
        this._redis.on('ready', () => {
            this.setReady(true);
        });
        this._redis.on('error', (err) => {
           Logger.warn(`${ this._name } redis connection error`);
        });
    }

    public get redis() {
        return this._redis.getClient();
    }

    public async shutdown() {
        this._redis.disconnect();
    }
}
