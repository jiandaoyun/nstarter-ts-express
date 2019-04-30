import { container } from './container';

import { MongodbComponent } from './mongodb.component';
import { RedisComponent } from './redis.component';
import { WsServerComponent } from './ws_server.components';
import { WsEmitterComponent } from './ws_emitter.components';
import { CronComponent } from './cron.component';
import { I18nComponent } from './i18n.component';
import { RpcServerComponent } from './rpc_server.component';
import { RpcClientComponent } from './rpc_client.component';
import { LoggerComponent } from './logger.component';

export const mongodb = container.get(MongodbComponent).db;
export const redis = container.get(RedisComponent).redis;
export const wsServer = container.get(WsServerComponent).server;
export const wsEmitter = container.get(WsEmitterComponent).emitter;
export const cron = container.get(CronComponent);
export const i18n = container.get(I18nComponent).i18n;
export const logger = container.get(LoggerComponent).logger;
export const reqLogger = container.get(LoggerComponent).reqLogger;
export const rpcServer = container.get(RpcServerComponent).server;
export const rpcClient = container.get(RpcClientComponent).clients;
