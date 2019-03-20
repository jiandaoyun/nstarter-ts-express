import { BaseService } from './service.base';
import { Services } from './enum';
import { Database } from '../database';

class RedisService extends BaseService {
    public name = Services.redis;

    public start (callback: Function) {
        Database.redis.connect(() => super.start(callback));
    }

    public stop (callback: Function) {
        Database.redis.disconnect(() => super.stop(callback));
    }
}

export const redisService = new RedisService();
