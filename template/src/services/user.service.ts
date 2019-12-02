import { userModel } from '../models/user.model';
import { IUserModel } from '../types/models/user';
import { BaseService, serviceProvider } from './base.service';
import { profiler } from '../decorators/monitor';

class UserService extends BaseService {
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

export const userService = serviceProvider(UserService);
