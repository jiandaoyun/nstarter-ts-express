import { BaseComponent } from './base.component';
import { RedisConnector } from './lib/database/redis.connection';
import { config } from '../config';
import { provideComponent } from './container';

@provideComponent()
export class RedisComponent extends BaseComponent {
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
