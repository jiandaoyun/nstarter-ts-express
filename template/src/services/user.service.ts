import { provideSvc } from './container';
import { session, transaction } from '../decorators';
import { userRepo } from '../repositories';
import { IUserModel } from '../types/models/user';

@provideSvc()
export class UserService {
    @transaction()
    public async userCreateTransaction(
        admin: IUserModel, member: IUserModel, @session sess?: never
    ) {
        await userRepo(sess).createOne(admin);
        await userRepo(sess).createOne(member);
    }
}
