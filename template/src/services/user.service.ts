import { userModel } from '../models/user.model';
import { IUserModel } from '../types/models/user';

export class UserService {
    public static createOne(user: IUserModel, callback: Callback) {
        userModel.create([user], (err, newUser) => callback(err, newUser));
    }

    public static findOneByUsername(username: string, callback: Callback) {
        userModel.findOne({ username })
            .lean(true)
            .exec((err, user: any) => callback(err, user));
    }
}
