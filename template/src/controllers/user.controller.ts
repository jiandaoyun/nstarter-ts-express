import { provideController } from './container';
import { session, transaction } from '../decorators';
import { userService } from '../services';
import { IUserModel } from '../types/models/user';

@provideController()
export class UserController {
    @transaction()
    public static async userCreateTransaction(
        admin: IUserModel, member: IUserModel, @session sess?: never
    ) {
        await userService(sess).createOne(admin);
        await userService(sess).createOne(member);
    }
}
