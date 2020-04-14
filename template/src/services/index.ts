import { registerSvc, getSvc } from 'nstarter-core';

import { PingService } from './ping.service';
import { PongService } from './pong.service';
import { UserService } from './user.service';
import { QueueService } from './queue.service';

registerSvc(QueueService);
registerSvc(UserService);
registerSvc(PingService);
registerSvc(PongService);

export const userService = getSvc<UserService>(UserService);
export const pingService = getSvc<PingService>(PingService);
export const pongService = getSvc<PongService>(PongService);
export const queueService = getSvc<QueueService>(QueueService);
