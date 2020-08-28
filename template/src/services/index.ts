import { registerSvc, getSvc } from 'nstarter-core';

import { PingService } from './ping.service';
import { PongService } from './pong.service';
//#module mongodb
import { UserService } from './user.service';
//#endmodule mongodb
//#module rabbitmq
import { QueueService } from './queue.service';
//#endmodule rabbitmq

//#module rabbitmq
registerSvc(QueueService);
//#endmodule rabbitmq
registerSvc(UserService);
registerSvc(PingService);
registerSvc(PongService);

export const userService = getSvc<UserService>(UserService);
export const pingService = getSvc<PingService>(PingService);
export const pongService = getSvc<PongService>(PongService);
//#module rabbitmq
export const queueService = getSvc<QueueService>(QueueService);
//#endmodule rabbitmq
