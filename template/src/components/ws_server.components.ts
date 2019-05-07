import SocketIO from 'socket.io';

import { BaseComponent } from './base.component';
import { WebSocket } from './lib/websocket/socket';
import { lazyInject, provideComponent } from './container';
import { RedisComponent } from './redis.component';
import { HttpServerComponent } from './http_server.component';

@provideComponent()
export class WsServerComponent extends BaseComponent {
    private _server: SocketIO.Server;

    @lazyInject(RedisComponent)
    private _redisComponent: RedisComponent;

    @lazyInject(HttpServerComponent)
    private _httpServerComponent: HttpServerComponent;

    constructor() {
        super();
        const redis = this._redisComponent.redis,
            httpServer = this._httpServerComponent.server;
        this._server = WebSocket.createServer(redis, httpServer);
        this.log();
    }

    public get server() {
        return this._server;
    }
}
