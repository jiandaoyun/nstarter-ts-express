import _ from 'lodash';
import fs from 'fs';
import querystring from 'querystring';
import { Logger } from 'nstarter-core';
import mongoose, { Connection, ConnectionOptions } from 'mongoose';
import { MongodbConfig } from '../../../types/config/database.config';

interface IMongodbQueryParams {
    replicaSet?: string;
}

export class MongodbConnector {
    public readonly connection: Connection;
    private readonly _options: MongodbConfig;
    private readonly _name: string = '';

    constructor(options: MongodbConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }
        this.connection = mongoose.createConnection(this.mongoUri, this.connectionConf);
        this.connection.on('error', (err) => {
            Logger.error(`${ this._tag } connection failed`, { error: err });
        });
        this.connection.once('open', () => {
            this.connection.on('disconnected', () => {
                Logger.error(`${ this._tag } disconnected`);
                return process.exit(1);
            });
            this.connection.on('reconnected', () => {
                Logger.error(`${ this._tag } reconnected`);
            });
        });
    }

    private get mongoUri(): string {
        const { db, servers, replicaSet } = this._options;
        const server = _.join(_.map(servers, (server) => `${ server.host }:${ server.port }`), ',');
        let uri = `mongodb://${ server }/${ db }`;
        // 扩展参数配置
        const queryParams: IMongodbQueryParams = {};
        if (replicaSet) {
            // 副本集
            queryParams.replicaSet = replicaSet;
        }
        if (!_.isEmpty(queryParams)) {
            uri += querystring.stringify(queryParams);
        }
        return uri;
    }

    /**
     * 获取数据库连接配置
     */
    private get connectionConf(): ConnectionOptions {
        const { user, password, db, x509 } = this._options;
        const baseConf = {
            user,
            autoReconnect: true,
            connectTimeoutMS: 10000,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            socketTimeoutMS: 0,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        if (x509 && !_.isEmpty(x509)) {
            // x509 认证方式
            return {
                ...baseConf,
                authMechanism: 'MONGODB-X509',
                authSource: '$external',
                ssl: true,
                sslValidate: true,
                // 加载证书，如出现异常，直接中断退出
                sslCA: [fs.readFileSync(x509.ca)],
                sslCert: fs.readFileSync(x509.cert),
                sslKey: fs.readFileSync(x509.key),
                checkServerIdentity: false
            };
        } else {
            // 用户名密码认证
            return {
                ...baseConf,
                authSource: db,
                pass: password
            };
        }
    }

    private get _tag(): string {
        return `Mongodb${ this._name ? `:${ this._name }` : '' }`;
    }
}
