import { Emitter } from "@socket.io/redis-emitter";
import { component, injectComponent } from 'nstarter-core';

import { AbstractComponent } from './abstract.component';
import { RedisComponent } from './redis.component';


@component()
export class WsEmitterComponent extends AbstractComponent {
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
