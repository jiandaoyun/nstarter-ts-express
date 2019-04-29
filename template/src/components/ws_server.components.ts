import { injectable } from 'inversify';
import 'reflect-metadata';
import SocketIO from 'socket.io';

import { BaseComponent } from './base.component';
import { Components, items } from './items';
import { WebSocket } from './lib/websocket/socket';
import { lazyInject } from './container';
import { RedisComponent } from './redis.component';

@injectable()
export class WsServerComponent extends BaseComponent {
    protected _name = Components.ws_server;
    private _server: SocketIO.Server;

    @lazyInject(items.Redis)
    private _redisComponent: RedisComponent;

    constructor() {
        super();
        const redis = this._redisComponent.redis;
        this._server = WebSocket.createServer(redis);
        this.log();
    }

    public get server() {
        return this._server;
    }
}
