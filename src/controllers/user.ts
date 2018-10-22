import { userModel, User } from "models/user";

export class UserControl {
    static createOne (user: User, callback: Function) {
        userModel.create([user], (err, newUser) => callback(err, newUser));
    }

    static findOneByUsername (username: string, callback: Function) {
        userModel.findOne({ username })
            .lean(true)
            .exec((err, user) => callback(err, user));
    }
}
