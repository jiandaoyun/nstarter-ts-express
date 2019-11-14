import _ from 'lodash';
import fs from 'fs';
import mongoose, { Connection, ConnectionOptions } from 'mongoose';
import { logger } from '../logger';
import { MongodbConfig } from '../../../types/config/database.config';

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
            logger.error(`${ this._tag } connection failed`, { error: err });
        });
        this.connection.once('open', () => {
            this.connection.on('disconnected', () => {
                logger.error(`${ this._tag } disconnected`);
                return process.exit(1);
            });
            this.connection.on('reconnected', () => {
                logger.error(`${ this._tag } reconnected`);
            });
        });
    }

    private get mongoUri(): string {
        const { mongod, mongos } = this._options;
        let server;
        if (mongos) {
            server = _.join(_.map(mongos, (server) => `${ server.host }:${ server.port }`), ',');
        } else if (mongod) {
            server = `${ mongod.host }:${ mongod.port }`;
        } else {
            return '';
        }
        return `mongodb://${ server }`;
    }

    /**
     * 获取数据库连接配置
     */
    private get connectionConf(): ConnectionOptions {
        const { user, password, db, x509 } = this._options;
        const baseConf = {
            user,
            db,
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
