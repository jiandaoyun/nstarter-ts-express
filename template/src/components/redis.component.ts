import { injectable } from 'inversify';
import 'reflect-metadata';

import { Components } from './items';
import { BaseComponent } from './base.component';
import { RedisConnector } from './lib/database/redis.connection';
import { config } from '../config';

@injectable()
export class RedisComponent extends BaseComponent {
    protected _name = Components.redis;
    private _redis: RedisConnector;

    constructor () {
        super();
        this._redis = new RedisConnector(config.database.redis);
        this._redis.connect(() => {});
        this.log();
    }

    public get redis() {
        return this._redis;
    }
}
