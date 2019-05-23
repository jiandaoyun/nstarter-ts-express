import mongoose, { Connection } from 'mongoose';
import { BaseConnection } from './base.connection';
import { MongodbConfig } from '../../../config/database.config';
import { logger } from '../logger';

export class MongodbConnector extends BaseConnection<MongodbConfig, Connection> {
    constructor (options: MongodbConfig) {
        super(options);

        this.connection = mongoose.createConnection(this.mongoUri, {
            autoReconnect: true,
            connectTimeoutMS: 10000,
            reconnectTries: Number.MAX_VALUE,
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
        const o = this._options;
        return `mongodb://${ o.user }:${ o.password }@${ o.mongod.host }:${ o.mongod.port }/${ o.db }`;
    }
}
