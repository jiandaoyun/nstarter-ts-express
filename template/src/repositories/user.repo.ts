import { userModel } from '../models/user.model';
import { IUserModel } from '../types/models/user';
import { BaseRepo, repoProvider } from './base.repo';
import { profiler } from '../decorators/plugins';

class UserRepo extends BaseRepo {
    public createOne(user: IUserModel) {
        return userModel.create([user], {
            session: this._session
        });
    }

    @profiler()
    public findOneByUsername(username: string) {
        return userModel.findOne({ username }).setOptions({
            session: this._session
        }).lean(true);
    }
}

export const userRepo = repoProvider(UserRepo);
