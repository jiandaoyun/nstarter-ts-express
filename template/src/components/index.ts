import { container } from './container';

//#module mongodb
import { MongodbComponent } from './mongodb.component';
export const mongodb = container.get(MongodbComponent).db;

//#endmodule mongodb
//#module redis
import { RedisComponent } from './redis.component';
export const redis = container.get(RedisComponent).redis;

//#endmodule redis
//#module ws_server
import { WsServerComponent } from './ws_server.component';
export const wsServer = container.get(WsServerComponent).server;

//#endmodule ws_server
//#module ws_emitter
import { WsEmitterComponent } from './ws_emitter.component';
export const wsEmitter = container.get(WsEmitterComponent).emitter;

//#endmodule ws_emitter
//#module cron
import { CronComponent } from './cron.component';
export const cron = container.get(CronComponent);

//#endmodule cron
//#module i18n
import { I18nComponent } from './i18n.component';
export const i18n = container.get(I18nComponent).i18n;

//#endmodule i18n
//#module grpc_server
import { RpcServerComponent } from './rpc_server.component';
export const rpcServer = container.get(RpcServerComponent).server;

//#endmodule grpc_server
//#module grpc_client
import { RpcClientComponent } from './rpc_client.component';
export const rpcClient = container.get(RpcClientComponent).clients;

//#endmodule grpc_client
//#module monitor

import { MonitorComponent } from './monitor.component';
export const monitor = container.get(MonitorComponent).monitor;
//#endmodule monitor

import { LoggerComponent } from './logger.component';
import { HttpServerComponent } from './http_server.component';

//#module rabbitmq
import { RabbitMQComponent } from './rabbitmq.component';
export const rabbitmq = container.get(RabbitMQComponent).rabbitmq;
//#endmodule rabbitmq

//#module queue
import { QueueComponent } from './queue.component';
export const queue = container.get(QueueComponent);
//#endmodule queue

export const logger = container.get(LoggerComponent).logger;
export const reqLogger = container.get(LoggerComponent).reqLogger;
export const httpServer = container.get(HttpServerComponent).server;
