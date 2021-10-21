import { getSvc, registerSvc } from 'nstarter-core';
//#module grpc_server
import { TaskHandlerService } from './grpc.service/handler/task.handler';
//#endmodule grpc_server
//#module grpc_client
import { TaskClientService } from './grpc.service/client/task.client';
//#endmodule grpc_client
import { PingService } from './ping.service';
import { PongService } from './pong.service';
//#module rabbitmq
import { QueueService } from './queue.service';
//#endmodule rabbitmq
import { UserService } from './user.service';

//#module rabbitmq
registerSvc(QueueService);
//#endmodule rabbitmq
registerSvc(UserService);
registerSvc(PingService);
registerSvc(PongService);
//#module grpc_server
registerSvc(TaskHandlerService);
//#endmodule grpc_server
//#module grpc_client
registerSvc(TaskClientService);
//#endmodule grpc_client

export const userService = getSvc<UserService>(UserService);
export const pingService = getSvc<PingService>(PingService);
export const pongService = getSvc<PongService>(PongService);
//#module rabbitmq
export const queueService = getSvc<QueueService>(QueueService);
//#endmodule rabbitmq
//#module grpc_server
export const rpcHandlerService = getSvc<TaskHandlerService>(TaskHandlerService);
//#endmodule grpc_server
//#module grpc_client
export const rpcClientService = getSvc<TaskClientService>(TaskClientService);
//#endmodule grpc_client
