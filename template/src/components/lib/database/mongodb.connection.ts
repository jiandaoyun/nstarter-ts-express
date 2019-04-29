import mongoose, { Connection } from 'mongoose';
import { BaseConnection } from './base.connection';
import { MongodbConfig } from '../../../config/database.config';
import { logger } from '../../../logger';

export class MongodbConnector extends BaseConnection<MongodbConfig, Connection> {
    constructor (options: MongodbConfig) {
        super(options);
    }

    private get mongoUri(): string {
        const o = this._options;
        return `mongod://${ o.user }:${ o.password }@${ o.mongod.host }:${ o.mongod.port }/${ o.db }`;
    }

    public connect (callback: Function) {
        mongoose.createConnection(this.mongoUri, {
            autoReconnect: true,
            connectTimeoutMS: 10000,
            reconnectTries: Number.MAX_VALUE,
            useNewUrlParser: true
        }).then((connection: Connection) => {
            this.connection = connection;
            this._connected = true;

            connection.on('error', (err) => {
                logger.error('Mognodb connection failed', { error: err });
            });
            connection.on('disconnected', () => {
                logger.error('Mognodb disconnected');
                return process.exit(1);
            });
            connection.on('reconnected', () => {
                logger.error('Mognodb reconnected');
            });
            return callback();
        }, (err) => callback(err));
    }

    public disconnect (callback: Function) {
        if (!this._connected) {
            return callback();
        }
        this.connection.removeAllListeners('disconnected');
        this.connection.close((err) => callback(err));
    }
}
