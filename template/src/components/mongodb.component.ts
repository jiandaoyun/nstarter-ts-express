import { component } from 'nstarter-core';
import { MongodbConnector } from 'nstarter-mongodb';

import { AbstractComponent } from './abstract.component';
import { config } from '../config';

@component()
export class MongodbComponent extends AbstractComponent {
    private readonly _db: MongodbConnector;

    constructor() {
        super();
        this._db = new MongodbConnector(config.database.mongodb, this._name);
        this._db.setAsDefault();
        this._db.connect().then(() => {
            this.setReady(true);
        });
    }

    public get db() {
        return this._db.connection;
    }

    public isReady(): boolean {
        return this._db.isReady();
    }

    public async shutdown() {
        await this._db.connection.close();
        this.setReady(false);
    }
}
