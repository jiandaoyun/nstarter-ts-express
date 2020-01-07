import { registerComponent, getComponent } from 'nstarter-core';

//#module mongodb
import { MongodbComponent } from './mongodb.component';
registerComponent(MongodbComponent);

//#endmodule mongodb
//#module redis
import { RedisComponent } from './redis.component';
registerComponent(RedisComponent);

//#endmodule redis
//#module ws_server
import { WsServerComponent } from './ws_server.component';
registerComponent(WsServerComponent);

//#endmodule ws_server
//#module ws_emitter
import { WsEmitterComponent } from './ws_emitter.component';
registerComponent(WsEmitterComponent);

//#endmodule ws_emitter
//#module cron
import { CronComponent } from './cron.component';
registerComponent(CronComponent);

//#endmodule cron
//#module i18n
import { I18nComponent } from './i18n.component';
registerComponent(I18nComponent);

//#endmodule i18n
//#module grpc_server
import { RpcServerComponent } from './rpc_server.component';
registerComponent(RpcServerComponent);

//#endmodule grpc_server
//#module grpc_client
import { RpcClientComponent } from './rpc_client.component';
registerComponent(RpcClientComponent);

//#endmodule grpc_client
//#module monitor

import { MonitorComponent } from './monitor.component';
registerComponent(MonitorComponent);
//#endmodule monitor

import { HttpServerComponent } from './http_server.component';
registerComponent(HttpServerComponent);

//#module rabbitmq
import { RabbitMQComponent } from './rabbitmq.component';
registerComponent(RabbitMQComponent);
//#endmodule rabbitmq

//#module mongodb
export const mongodb = getComponent<MongodbComponent>(MongodbComponent).db;
//#endmodule mongodb
//#module redis
export const redis = getComponent<RedisComponent>(RedisComponent);
//#endmodule redis
//#module ws_server
export const wsServer = getComponent<WsServerComponent>(WsServerComponent);
//#endmodule ws_server
//#module ws_emitter
export const wsEmitter = getComponent<WsEmitterComponent>(WsEmitterComponent);
//#endmodule ws_emitter
//#module cron
export const cron = getComponent<CronComponent>(CronComponent);
//#endmodule cron
//#module i18n
export const i18n = getComponent<I18nComponent>(I18nComponent).i18n;
//#endmodule i18n
//#module grpc_server
export const rpcServer = getComponent<RpcServerComponent>(RpcServerComponent).server;
//#endmodule grpc_server
//#module grpc_client
export const rpcClient = getComponent<RpcClientComponent>(RpcClientComponent).clients;
//#endmodule grpc_client
//#module monitor
export const monitor = getComponent<MonitorComponent>(MonitorComponent).monitor;
//#endmodule monitor
//#module rabbitmq
export const rabbitmq = getComponent<RabbitMQComponent>(RabbitMQComponent);
export const amqp = rabbitmq.amqp;
//#endmodule rabbitmq

export const httpServer = getComponent<HttpServerComponent>(HttpServerComponent).server;
//#module monitor
export const monitorServer = getComponent<HttpServerComponent>(HttpServerComponent).monitor;
//#endmodule monitor
