import mongoose, { Connection } from 'mongoose';
import { MongodbConfig } from '../../../config/database.config';
import { logger } from '../logger';

export class MongodbConnector {
    private readonly _options: MongodbConfig;
    public readonly connection: Connection;

    constructor(options: MongodbConfig) {
        this._options = options;
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
        this.connection.once('open', () => {
            this.connection.on('error', (err) => {
                logger.error('Mongodb connection failed', { error: err });
            });
            this.connection.on('disconnected', () => {
                logger.error('Mongodb disconnected');
                return process.exit(1);
            });
            this.connection.on('reconnected', () => {
                logger.error('Mongodb reconnected');
            });
        });
    }

    private get mongoUri(): string {
        const { user, password, mongod, db } = this._options;
        if (!user || !password) {
            // 本地开发使用
            return `mongodb://${ mongod.host }:${ mongod.port }/${ db }`;
        }
        return `mongodb://${ user }:${ password }@${ mongod.host }:${ mongod.port }/${ db }`;
    }
}
