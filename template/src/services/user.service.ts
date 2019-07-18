import { userModel, IUser } from '../models/user.model';

export class UserService {
    public static createOne(user: IUser, callback: Function) {
        userModel.create([user], (err, newUser) => callback(err, newUser));
    }

    public static findOneByUsername(username: string, callback: Function) {
        userModel.findOne({ username })
            .lean(true)
            .exec((err, user: any) => callback(err, user));
    }
}
