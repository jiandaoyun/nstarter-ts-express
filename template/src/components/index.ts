import { registerComponent, getComponent } from 'nstarter-core';
import { beforeLoad } from './before';

// 组件加载前的前置行为
beforeLoad();

//#module mongodb
import { MongodbComponent } from './mongodb.component';
registerComponent(MongodbComponent);
export const mongodbComponent = getComponent<MongodbComponent>(MongodbComponent);
export const mongodb = mongodbComponent.db;
//#endmodule mongodb

//#module redis
import { RedisComponent } from './redis.component';
registerComponent(RedisComponent);
export const redisComponent = getComponent<RedisComponent>(RedisComponent);
export const redis = redisComponent.redis;
//#endmodule redis

//#module rabbitmq
import { RabbitMqComponent } from './rabbitmq.component';
registerComponent(RabbitMqComponent);
export const rabbitMqComponent = getComponent<RabbitMqComponent>(RabbitMqComponent);
export const amqp = rabbitMqComponent.amqp;
//#endmodule rabbitmq

//#module grpc_server
import { GrpcServerComponent } from './grpc_server.component';
registerComponent(GrpcServerComponent);
export const grpcServer = getComponent<GrpcServerComponent>(GrpcServerComponent);
//#endmodule grpc_server

//#module grpc_client
import { GrpcClientComponent } from './grpc_client.component';
registerComponent(GrpcClientComponent);
export const grpcClient = getComponent<GrpcClientComponent>(GrpcClientComponent);
//#endmodule grpc_client

//#module ws_server
import { WsServerComponent } from './ws_server.component';
registerComponent(WsServerComponent);
export const wsServerComponent = getComponent<WsServerComponent>(WsServerComponent);
//#endmodule ws_server

//#module ws_emitter
import { WsEmitterComponent } from './ws_emitter.component';
registerComponent(WsEmitterComponent);
export const wsEmitter = getComponent<WsEmitterComponent>(WsEmitterComponent).emitter;
//#endmodule ws_emitter

//#module i18n
import { I18nComponent } from './i18n.component';
registerComponent(I18nComponent);
export const i18n = getComponent<I18nComponent>(I18nComponent).i18n;
//#endmodule i18n

//#module monitor
import { MonitorComponent } from './monitor.component';
registerComponent(MonitorComponent);
export const monitorComponent = getComponent<MonitorComponent>(MonitorComponent);
export const monitor = monitorComponent.monitor;
//#endmodule monitor

import { HttpServerComponent } from './http_server.component';
registerComponent(HttpServerComponent);
export const httpServerComponent = getComponent<HttpServerComponent>(HttpServerComponent);
//#endmodule monitor
