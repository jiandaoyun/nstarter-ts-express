import { BaseComponent, component } from 'nstarter-core';
import { MongodbConnector } from 'nstarter-mongodb';

import { config } from '../config';

@component()
export class MongodbComponent extends BaseComponent {
    private readonly _db: MongodbConnector;

    constructor() {
        super();
        this._db = new MongodbConnector(config.storage.mongodb, this._name);
        this._db.setAsDefault();
    }

    public async init() {
        await this._db.connect();
        this.setReady(true);
    }

    public get db() {
        return this._db.connection;
    }

    public isReady(): boolean {
        return this._db.isReady();
    }

    public async shutdown() {
        await super.shutdown();
        await this._db.connection.close();
    }
}
