import SocketIO from 'socket.io';
import { BaseService } from './base.service';
import { Services } from './enum';
import { WebSocket } from '../websocket/socket';

class WebSocketService extends BaseService {
    public name = Services.websocket;
    public wanted = [
        Services.redis
    ];
    private _io: SocketIO.Server;

    public start (callback: Function) {
        this._io = WebSocket.createServer();
        return super.start(callback);
    }

    public stop (callback: Function) {
        if (this._io) {
            this._io.close();
        }
        return super.stop(callback);
    }
}

export const webSocketService = new WebSocketService();
