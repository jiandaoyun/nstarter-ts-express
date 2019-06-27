import qs from 'qs';
import _ from 'lodash';
import async from 'async';
import { EventEmitter } from 'events';
import amqp, { Connection } from 'amqplib/callback_api';

import { RabbitMQConfig, RabbitMQParams } from '../../../config/database.config';
import { logger } from '../logger';

interface ConnectOptions {
    connectParams?: RabbitMQParams,
    reconnectInterval?: number
}

class AMQPConnection extends EventEmitter {
    private readonly _urls: string[];
    private readonly _params: Required<RabbitMQParams>;
    private readonly _connectionMap: Record<string, Connection>;
    private readonly _connectingUrls: Set<string>;

    private readonly _reconnectInterval: number;

    private _closed: boolean;

    constructor(urls: string[], options: ConnectOptions) {
        super();
        this._connectionMap = {};
        this._connectingUrls = new Set();
        this._urls = urls;
        this._params = _.defaults(options.connectParams, {
            heartbeat: 0,
            frameMax: 0,
            channelMax: 0,
            locale: 'en_US'
        });
        this._reconnectInterval = options.reconnectInterval || 1000;
        this.setMaxListeners(0);
    }

    private _connectUrl (
        url: string,
        callback: Callback
    ): void {
        if (this._closed) {
            return callback();
        }
        this._connectingUrls.add(url);
        amqp.connect(url, {}, (err?: Error, conn?: Connection) => {
            this._connectingUrls.delete(url);
            if (err || !conn) {
                return callback(err);
            }
            conn.on('blocked', (err) =>
                this.emit('blocked', { err, url })
            );
            conn.on('unblocked', () => this.emit('unblocked'));
            conn.on('error', () => {
                // noop
            });
            conn.on('close', (err) => {
                _.unset(this._connectionMap, [url]);
                this.emit('disconnect', { err, url });

                setTimeout(() => {
                    process.nextTick(() => {
                        this._connectUrl(url, _.noop);
                    });
                }, this._reconnectInterval);
            });
            this.emit('connect', { url });
            this._connectionMap[url] = conn;
            return callback();
        });
    }

    public connect(
        callback: Callback = _.noop
    ): void {
        const paramStr: string = qs.stringify(this._params);
        async.eachLimit(this._urls, 5, (url: string, callback: Callback) => {
            const connectUrl = `${ url }?${ paramStr }`;
            if (_.has(this._connectionMap, connectUrl) || this._connectingUrls.has(connectUrl)) {
                // 已连接、正在连接
                return callback();
            }
            this._connectUrl(url, callback);
        }, (err?: Error) => {
            if (err) {
                if (_.isEmpty(this._connectionMap)) {
                    return callback(err);
                }
                // 有任意连接创建成功，不阻止启动
                logger.warn(err);
            }
            return callback();
        });
    }

    public close(
        callback: Callback = _.noop
    ): void {
        if (this._closed) {
            return callback();
        }
        this._closed = true;
        async.eachLimit(
            this._connectionMap,
            5,
            (conn: Connection, callback: Callback) => {
                conn.removeAllListeners();
                conn.close(callback);
            },
            () => callback()
        );
    }

    public getConnection(): Connection | undefined {
        return _.sample(this._connectionMap);
    }
}

export class RabbitMQConnector {
    private readonly _options: RabbitMQConfig;
    private readonly _connection: AMQPConnection;

    constructor(options: RabbitMQConfig) {
        this._options = options;

        this._connection = new AMQPConnection(this.amqpUrls, {
            connectParams: options.params,
            reconnectInterval: 1000
        });
        this._connection.connect((err?: Error) => {
            if (err) {
                logger.error(err);
            }
        });
    }

    private get amqpUrls(): string[] {
        const { user, password, protocol, brokers } = this._options,
            vhost = encodeURIComponent(this._options.vhost || '/');
        return _.map(brokers, (broker) => {
            const { host, port = 5670 } = broker;
            return `${ protocol }://${ user }:${ password }@${ host }:${ port }/${ vhost }`;
        });
    }

    public connect(callback?: Callback): void {
        this._connection.connect(callback);
    }

    public close(callback?: Callback): void {
        this._connection.close(callback);
    }

    public getConnection(): Connection {
        return this._connection.getConnection() as Connection;
    }
}
