import SocketIOEmitter, { Emitter } from 'socket.io-emitter';

import { BaseComponent } from './base.component';
import { lazyInject, provideComponent } from './container';
import { RedisComponent } from './redis.component';

@provideComponent()
export class WsEmitterComponent extends BaseComponent {
    private _emitter: Emitter;

    @lazyInject(RedisComponent)
    private _redisComponent: RedisComponent;

    constructor() {
        super();
        const redis = this._redisComponent.redis;
        this._emitter = SocketIOEmitter(redis.connection);
        this.log();
    }

    public get emitter() {
        return this._emitter;
    }
}
