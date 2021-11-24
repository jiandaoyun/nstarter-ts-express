import { Socket } from 'socket.io';
import { Request } from 'express';

import { BaseChannel } from './base.channel';
import { Consts } from '../../../../constants';

class MessageChannel extends BaseChannel {
    public async connect(socket: Socket) {
        const session = (socket.request as Request).session;
        const user = session?.user;
        if (!user) {
            return;
        }
        const roomKey = `${ Consts.System.WS_MSG_ROOM_KEY }${ user._id }`;
        await socket.join(roomKey);
        return roomKey;
    }
}

export const messageChannel = new MessageChannel();
