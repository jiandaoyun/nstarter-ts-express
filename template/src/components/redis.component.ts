import { component } from 'nstarter-core';

import { AbstractComponent } from './abstract.component';
import { RedisConnector } from './lib/database/redis.connection';
import { config } from '../config';

@component()
export class RedisComponent extends AbstractComponent {
    private readonly _redis: RedisConnector;

    constructor() {
        super();
        this._redis = new RedisConnector(config.database.redis, this._name);
        this.redis.connect(() => {
            this.redis.on('ready', () => {
                this.ready = true;
            });
        });
    }

    public get redis() {
        return this._redis.connection;
    }

    public async shutdown() {
        this._redis.connection.disconnect();
    }
}
