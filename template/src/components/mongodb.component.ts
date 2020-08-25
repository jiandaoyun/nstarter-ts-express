import { component } from 'nstarter-core';

import { AbstractComponent } from './abstract.component';
import { MongodbConnector } from './lib/database/mongodb.connection';
import { config } from '../config';

@component()
export class MongodbComponent extends AbstractComponent {
    private readonly _db: MongodbConnector;

    constructor() {
        super();
        this._db = new MongodbConnector(config.database.mongodb, this._name);
        if (this._db.isReady()) {
            this.ready = true;
        } else {
            this._db.connection.once('open', () => {
                this.ready = true;
            });
        }
    }

    public get db() {
        return this._db.connection;
    }

    public async shutdown() {
        await this._db.connection.close();
    }
}
