import { Emitter } from "@socket.io/redis-emitter";
import { BaseComponent, component, injectComponent } from 'nstarter-core';

import { RedisComponent } from './redis.component';


@component()
export class WsEmitterComponent extends BaseComponent {
    private readonly _emitter: Emitter;

    @injectComponent()
    private _redisComponent: RedisComponent;

    constructor() {
        super();
        const redis = this._redisComponent.redis;
        this._emitter = new Emitter(redis);
        this.setReady(true);
    }

    public get emitter() {
        return this._emitter;
    }
}
