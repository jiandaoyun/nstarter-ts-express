import { BaseService } from './base.service';
import { Services } from './enum';
import { Database } from '../database';

class MongodbService extends BaseService {
    public name = Services.mongodb;

    public start (callback: Function) {
        Database.mongodb.connect(() => super.start(callback) );
    }

    public stop (callback: Function) {
        Database.mongodb.disconnect(() => super.stop(callback));
    }
}

export const mongodbService = new MongodbService();