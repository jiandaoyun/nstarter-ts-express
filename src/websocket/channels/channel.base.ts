import { Socket } from 'socket.io';

abstract class BaseChannel {
    public abstract connect (socket: Socket, callback: Function): void;
}

export = BaseChannel;
