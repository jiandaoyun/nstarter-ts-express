import { userRepo } from '../repositories';
import { IUserModel } from '../types/models/user';
import { provideSvc } from 'nstarter-core';
import { repoSession, transaction } from '../decorators';

@provideSvc()
export class UserService {
    @transaction()
    public async userCreateTransaction(
        admin: IUserModel, member: IUserModel, @repoSession sess?: never
    ) {
        await userRepo(sess).createOne(admin);
        await userRepo(sess).createOne(member);
    }
}
