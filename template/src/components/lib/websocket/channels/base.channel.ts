import { Socket } from 'socket.io';

export abstract class BaseChannel {
    public abstract connect (socket: Socket): Promise<string | undefined>;
}
