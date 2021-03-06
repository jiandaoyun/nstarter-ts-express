import { profiler } from 'nstarter-metrics';
import { MongodbRepo, repoProvider } from 'nstarter-mongodb';
import { userModel } from '../models/user.model';
import { IUserModel } from '../types/models/user';

class UserRepo extends MongodbRepo {
    public async createOne(user: IUserModel) {
        return userModel.create([user], {
            session: this._session
        });
    }

    @profiler()
    public async findOneByUsername(username: string) {
        return userModel.findOne({ username }).setOptions({
            session: this._session
        }).lean(true);
    }
}

export const userRepo = repoProvider(UserRepo);
