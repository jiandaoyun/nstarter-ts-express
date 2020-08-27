import _ from 'lodash';
import fs from 'fs';
import querystring from 'querystring';
import { Logger } from 'nstarter-core';
import mongoose, { Connection, ConnectionOptions, Promise } from 'mongoose';
import { IMongodbConfig } from '../../../types/config/database.config';

interface IMongodbQueryParams {
    replicaSet?: string;
}

export class MongodbConnector {
    public readonly connection: Connection;
    private readonly _options: IMongodbConfig;
    private readonly _name: string = '';

    constructor(options: IMongodbConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }
        this.connection = mongoose.createConnection();
    }

    /**
     * 数据库连接入口方法
     */
    public connect(): Promise<Connection | void> {
        return this._connectDatabase().then(() => {
            this.connection.on('disconnected', () => {
                Logger.error(`${ this._tag } 数据库连接已断开`);
            });
            this.connection.on('reconnected', () => {
                Logger.error(`${ this._tag } 数据库连接已恢复`);
            });
        });
    }

    /**
     * 建立数据库连接
     * @private
     */
    private async _connectDatabase(): Promise<void> {
        try {
            await this.connection.openUri(this.mongoUri, this.connectionConf);
        } catch (err) {
            Logger.error(`${ this._tag } 数据库连接建立失败，重试连接`, { error: err });
            await this._connectDatabase();
        }
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
            uri += '?' + querystring.stringify(queryParams);
        }
        return uri;
    }

    /**
     * 获取数据库连接配置
     */
    private get connectionConf(): ConnectionOptions {
        const { user, password, db, x509, timeoutMs } = this._options;
        const baseConf = {
            user,
            serverSelectionTimeoutMS: timeoutMs || 10000,
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

    public isReady(): boolean {
        return this.connection.readyState === 1;
    }
}
