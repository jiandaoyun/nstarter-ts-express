import SocketIO from 'socket.io';
import { component, injectComponent } from 'nstarter-core';

import { AbstractComponent } from './abstract.component';
import { WebSocket } from './lib/websocket/socket';
import { RedisComponent } from './redis.component';
import { HttpServerComponent } from './http_server.component';

@component()
export class WsServerComponent extends AbstractComponent {
    private _server: SocketIO.Server;

    @injectComponent()
    private _redisComponent: RedisComponent;

    @injectComponent()
    private _httpServerComponent: HttpServerComponent;

    public start() {
        if (!this._server) {
            const redis = this._redisComponent.redis,
                httpServer = this._httpServerComponent.server;
            this._server = WebSocket.createServer(redis, httpServer);
            this.ready = true;
        }
    }

    public get server() {
        return this._server;
    }

    public async shutdown() {
        this._server.close();
    }
}
