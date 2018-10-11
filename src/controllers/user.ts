import { userModel } from "models/user";

export class UserControl {
    static findByUsername (username: string, callback: Function) {
        userModel.findOne({ username })
            .lean(true)
            .exec((err, user) => callback(err, user));
    }
}
