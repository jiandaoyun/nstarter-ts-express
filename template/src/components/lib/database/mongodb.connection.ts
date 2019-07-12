import _ from 'lodash';
import mongoose, { Connection } from 'mongoose';
import { MongodbConfig } from '../../../config/database.config';
import { logger } from '../logger';

export class MongodbConnector {
    private readonly _options: MongodbConfig;
    private readonly _name: string = '';
    public readonly connection: Connection;

    constructor(options: MongodbConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }
        this.connection = mongoose.createConnection(this.mongoUri, {
            autoReconnect: true,
            connectTimeoutMS: 10000,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            socketTimeoutMS: 0,
            useCreateIndex: true,
            useNewUrlParser: true
        });
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
        const { user, password, mongod, mongos, db } = this._options;
        let server;
        if (mongos) {
            server = _.join(_.map(mongos, (server) => `${ server.host }:${ server.port }`), ',');
        } else if (mongod) {
            server = `${ mongod.host }:${ mongod.port }`;
        } else {
            return '';
        }
        if (!user || !password) {
            // 本地开发使用
            return `mongodb://${ server }/${ db }`;
        }
        return `mongodb://${ user }:${ password }@${ server }/${ db }`;
    }

    private get _tag(): string {
        return `Mongodb${ this._name ? `:${ this._name }` : ''}`;
    }
}
