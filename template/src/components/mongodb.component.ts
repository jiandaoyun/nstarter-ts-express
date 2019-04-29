import { injectable } from 'inversify';

import { Components } from './components';
import { BaseComponent } from './base.component';
import { MongodbConnector } from './lib/database/mongodb.connection';
import { config } from '../config';

@injectable()
export class MongodbComponent extends BaseComponent {
    protected _name = Components.mongodb;
    private _db: MongodbConnector;

    constructor () {
        super();
        this._db = new MongodbConnector(config.database.mongodb);
        this._db.connect(() => {});
        this.log();
    }

    public get db() {
        return this._db;
    }
}
