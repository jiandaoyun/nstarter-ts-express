import { registerComponent, getComponent } from 'nstarter-core';
import { beforeLoad } from './before';

// 组件加载前的前置行为
beforeLoad();

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
//#module grpc
import { GrpcServerComponent } from './grpc_server.component';
registerComponent(GrpcServerComponent);

//#endmodule grpc
//#module monitor

import { MonitorComponent } from './monitor.component';
registerComponent(MonitorComponent);
//#endmodule monitor

import { HttpServerComponent } from './http_server.component';
registerComponent(HttpServerComponent);

//#module rabbitmq
import { RabbitMqComponent } from './rabbitmq.component';
registerComponent(RabbitMqComponent);
//#endmodule rabbitmq

//#module mongodb
export const mongodbComponent = getComponent<MongodbComponent>(MongodbComponent);
export const mongodb = mongodbComponent.db;
//#endmodule mongodb
//#module redis
export const redisComponent = getComponent<RedisComponent>(RedisComponent);
export const redis = redisComponent;
//#endmodule redis
//#module ws_server
export const wsServerComponent = getComponent<WsServerComponent>(WsServerComponent);
export const wsServer = wsServerComponent;
//#endmodule ws_server
//#module ws_emitter
export const wsEmitter = getComponent<WsEmitterComponent>(WsEmitterComponent).emitter;
//#endmodule ws_emitter
//#module cron
export const cron = getComponent<CronComponent>(CronComponent);
//#endmodule cron
//#module i18n
export const i18n = getComponent<I18nComponent>(I18nComponent).i18n;
//#endmodule i18n
//#module grpc
export const grpcServer = getComponent<GrpcServerComponent>(GrpcServerComponent);
//#endmodule grpc
//#module monitor
export const monitorComponent = getComponent<MonitorComponent>(MonitorComponent);
export const monitor = monitorComponent.monitor;
//#endmodule monitor
//#module rabbitmq
export const rabbitMqComponent = getComponent<RabbitMqComponent>(RabbitMqComponent);
export const amqp = rabbitMqComponent.amqp;
//#endmodule rabbitmq

export const httpServerComponent = getComponent<HttpServerComponent>(HttpServerComponent);
export const httpServer = httpServerComponent.server;
//#module monitor
export const monitorServer = getComponent<HttpServerComponent>(HttpServerComponent).monitor;
//#endmodule monitor
