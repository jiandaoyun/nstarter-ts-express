import { AbstractComponent } from './abstract.component';
import { RedisConnector } from './lib/database/redis.connection';
import { config } from '../config';
import { provideComponent } from './container';

@provideComponent()
export class RedisComponent extends AbstractComponent {
    private readonly _redis: RedisConnector;

    constructor () {
        super();
        this._redis = new RedisConnector(config.database.redis, this._name);
        this.log();
    }

    public get redis() {
        return this._redis;
    }
}
