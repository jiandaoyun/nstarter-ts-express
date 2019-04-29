import SocketIO from 'socket.io';

import { BaseComponent } from './base.component';
import { WebSocket } from './lib/websocket/socket';
import { lazyInject, provideComponent } from './container';
import { RedisComponent } from './redis.component';

@provideComponent()
export class WsServerComponent extends BaseComponent {
    private _server: SocketIO.Server;

    @lazyInject(RedisComponent)
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
