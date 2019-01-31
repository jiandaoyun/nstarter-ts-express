import { BaseChannel } from './channel.base';
import { Socket } from 'socket.io';
import { Consts } from '../../constants';

class MessageChannel extends BaseChannel {
    public connect(socket: Socket, callback: Function) {
        const session = socket.request.session;
        const user = session.user;
        if (!user) {
            return callback();
        }
        const roomKey = `${ Consts.System.WS_MSG_ROOM_KEY }${ user._id }`;
        socket.join(roomKey, (err) => {
            if (err) {
                return callback();
            }
            return callback(null, roomKey);
        });
    }
}

export const messageChannel = new MessageChannel();
