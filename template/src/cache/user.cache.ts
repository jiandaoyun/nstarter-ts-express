import { AbstractCacheManager } from 'nstarter-cache';
import { redis } from '../components';
import { IUserModel } from '../repositories';

/**
 * 用户缓存管理器示例
 */
export class UserCacheManager extends AbstractCacheManager<IUserModel, string> {
    private _cacheKeyPrefix = 'cache:user:';

    /**
     * 缓存 key 生成方法
     * @param keyArg
     * @protected
     */
    protected _getCacheKey(keyArg: string) {
        return this._cacheKeyPrefix + keyArg;
    };

    /**
     * 清除制定缓存
     * @param keyArg
     * @protected
     */
    protected async _evictCache(keyArg: string) {
        const key = this._getCacheKey(keyArg);
        await redis.del(key);
    }

    /**
     * 获取制定缓存
     * @param keyArg
     * @protected
     */
    protected async _getCache(keyArg: string) {
        const key = this._getCacheKey(keyArg);
        const content = await redis.get(key);
        if (!content) {
            return;
        }
        return JSON.parse(content) as IUserModel;
    }

    /**
     * 存储缓存
     * @param keyArg
     * @param content
     * @protected
     */
    protected async _putCache(keyArg: string, content: IUserModel) {
        const key = this._getCacheKey(keyArg);
        await redis.set(key, JSON.stringify(content));
    }
}

export const userCacheManager = new UserCacheManager();
