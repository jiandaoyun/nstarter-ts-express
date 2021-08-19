import { getSvc, registerSvc } from 'nstarter-core';
import { TaskHandlerService } from './grpc.service/handler/task.handler';
import { TaskClientService } from './grpc.service/client/task.client';
import { PingService } from './ping.service';
import { PongService } from './pong.service';
import { QueueService } from './queue.service';
import { UserService } from './user.service';


registerSvc(QueueService);
registerSvc(UserService);
registerSvc(PingService);
registerSvc(PongService);
registerSvc(TaskHandlerService);
registerSvc(TaskClientService);

export const userService = getSvc<UserService>(UserService);
export const pingService = getSvc<PingService>(PingService);
export const pongService = getSvc<PongService>(PongService);
export const queueService = getSvc<QueueService>(QueueService);
export const rpcHandlerService = getSvc<TaskHandlerService>(TaskHandlerService);
export const rpcClientService = getSvc<TaskClientService>(TaskClientService);
