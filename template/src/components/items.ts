export const items = {
    Mongodb: Symbol('Mongodb'),
    Redis: Symbol('Redis'),
    WsServer: Symbol('WsServer'),
    WsEmitter: Symbol('WsEmitter'),
    Cron: Symbol('Cron'),
    I18n: Symbol('I18n'),
    RpcServer: Symbol('RpcServer'),
    RpcClient: Symbol('RpcClient')
};

export enum Components {
    i18n = 'i18n',
    mongodb = 'mongodb',
    redis = 'redis',
    ws_server = 'ws_server',
    ws_emitter = 'ws_emitter',
    http = 'http',
    cron = 'cron',
    rpc_server = 'rpc_server',
    rpc_client = 'rpc_client'
}
