import { registerComponent, getComponent } from './container';

//#module mongodb
import { MongodbComponent } from './mongodb.component';
registerComponent(MongodbComponent);
export const mongodb = getComponent<MongodbComponent>(MongodbComponent).db;

//#endmodule mongodb
//#module redis
import { RedisComponent } from './redis.component';
registerComponent(RedisComponent);
export const redis = getComponent<RedisComponent>(RedisComponent);

//#endmodule redis
//#module ws_server
import { WsServerComponent } from './ws_server.component';
registerComponent(WsServerComponent);
export const wsServer = getComponent<WsServerComponent>(WsServerComponent);

//#endmodule ws_server
//#module ws_emitter
import { WsEmitterComponent } from './ws_emitter.component';
registerComponent(WsEmitterComponent);
export const wsEmitter = getComponent<WsEmitterComponent>(WsEmitterComponent);

//#endmodule ws_emitter
//#module cron
import { CronComponent } from './cron.component';
registerComponent(CronComponent);
export const cron = getComponent<CronComponent>(CronComponent);

//#endmodule cron
//#module i18n
import { I18nComponent } from './i18n.component';
registerComponent(I18nComponent);
export const i18n = getComponent<I18nComponent>(I18nComponent).i18n;

//#endmodule i18n
//#module grpc_server
import { RpcServerComponent } from './rpc_server.component';
registerComponent(RpcServerComponent);
export const rpcServer = getComponent<RpcServerComponent>(RpcServerComponent).server;

//#endmodule grpc_server
//#module grpc_client
import { RpcClientComponent } from './rpc_client.component';
registerComponent(RpcClientComponent);
export const rpcClient = getComponent<RpcClientComponent>(RpcClientComponent).clients;

//#endmodule grpc_client
//#module monitor

import { MonitorComponent } from './monitor.component';
registerComponent(MonitorComponent);
export const monitor = getComponent<MonitorComponent>(MonitorComponent).monitor;
//#endmodule monitor

import { LoggerComponent } from './logger.component';
import { HttpServerComponent } from './http_server.component';

//#module rabbitmq
import { RabbitMQComponent } from './rabbitmq.component';
registerComponent(RabbitMQComponent);
export const rabbitmq = getComponent<RabbitMQComponent>(RabbitMQComponent);
//#endmodule rabbitmq

//#module mq_producer
import { MQProducerComponent } from './mq_producer.component';
registerComponent(MQProducerComponent);
export const mqProducer = getComponent<MQProducerComponent>(MQProducerComponent);
//#endmodule mq_producer

//#module mq_consumer
import { MQConsumerComponent } from './mq_consumer.component';
registerComponent(MQConsumerComponent);
export const mqConsumer = getComponent<MQConsumerComponent>(MQConsumerComponent);
//#endmodule mq_consumer

registerComponent(LoggerComponent);
export const logger = getComponent<LoggerComponent>(LoggerComponent).logger;
export const reqLogger = getComponent<LoggerComponent>(LoggerComponent).reqLogger;

registerComponent(HttpServerComponent);
export const httpServer = getComponent<HttpServerComponent>(HttpServerComponent).server;
//#module monitor
export const monitorServer = getComponent<HttpServerComponent>(HttpServerComponent).monitor;
//#endmodule monitor
