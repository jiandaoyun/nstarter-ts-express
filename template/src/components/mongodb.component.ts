import { AbstractComponent } from './abstract.component';
import { MongodbConnector } from './lib/database/mongodb.connection';
import { config } from '../config';
import { provideComponent } from './container';

@provideComponent()
export class MongodbComponent extends AbstractComponent {
    private readonly _db: MongodbConnector;

    constructor () {
        super();
        this._db = new MongodbConnector(config.database.mongodb, this._name);
        this.log();
    }

    public get db() {
        return this._db;
    }
}
