import { items } from './items';
import { MongodbComponent } from './mongodb.component';
import { RedisComponent } from './redis.component';
import { WsServerComponent } from './ws_server.components';
import { WsEmitterComponent } from './ws_emitter.components';
import { CronComponent } from './cron.component';
import { I18nComponent } from './i18n.component';
import { container } from './container';
import { RpcServerComponent } from './rpc_server.component';
import { RpcClientComponent } from './rpc_client.component';

container.bind(items.Mongodb).to(MongodbComponent).inSingletonScope();
container.bind(items.Redis).to(RedisComponent).inSingletonScope();
container.bind(items.WsServer).to(WsServerComponent).inSingletonScope();
container.bind(items.WsEmitter).to(WsEmitterComponent).inSingletonScope();
container.bind(items.Cron).to(CronComponent).inSingletonScope();
container.bind(items.I18n).to(I18nComponent).inSingletonScope();
container.bind(items.RpcServer).to(RpcServerComponent).inSingletonScope();
container.bind(items.RpcClient).to(RpcClientComponent).inSingletonScope();

export const mongodb = container.get<MongodbComponent>(items.Mongodb).db;
export const redis = container.get<RedisComponent>(items.Redis).redis;
export const wsServer = container.get<WsServerComponent>(items.WsServer).server;
export const wsEmitter = container.get<WsEmitterComponent>(items.WsEmitter).emitter;
export const cron = container.get<CronComponent>(items.Cron);
export const i18n = container.get<I18nComponent>(items.I18n).i18n;
export const rpcServer = container.get<RpcServerComponent>(items.RpcServer).server;
export const rpcClient = container.get<RpcClientComponent>(items.RpcClient).clients;
