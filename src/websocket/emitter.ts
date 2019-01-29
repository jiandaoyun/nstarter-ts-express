import SocketIOEmitter, { Emitter } from 'socket.io-emitter';
import Database from '../database';

/**
 * Websocket emitter for sending messages
 */
class WsEmitter {
    private _emitter: Emitter;

    private _createEmitter (): Emitter {
        return SocketIOEmitter(Database.redis.connect);
    }

    protected get emitter (): Emitter {
        return this._emitter || (this._emitter = this._createEmitter());
    }
}

const emitter = new WsEmitter();
export = emitter;
