import { BaseComponent } from './base.component';
import { MongodbConnector } from './lib/database/mongodb.connection';
import { config } from '../config';
import { provideComponent } from './container';

@provideComponent()
export class MongodbComponent extends BaseComponent {
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
