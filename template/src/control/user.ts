import { userModel, User } from '../models/user';

export class UserControl {
    public static createOne (user: User, callback: Function) {
        userModel.create([user], (err, newUser) => callback(err, newUser));
    }

    public static findOneByUsername (username: string, callback: Function) {
        userModel.findOne({ username })
            .lean(true)
            .exec((err, user: any) => callback(err, user));
    }
}
