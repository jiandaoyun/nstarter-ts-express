import { injectable } from 'inversify';
import SocketIOEmitter, { Emitter } from 'socket.io-emitter';

import { BaseComponent } from './base.component';
import { Components } from './components';
import { lazyInject } from './container';
import { RedisComponent } from './redis.component';

@injectable()
export class WsEmitterComponent extends BaseComponent {
    protected _name = Components.ws_emitter;
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
