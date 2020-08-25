import { service } from 'nstarter-core';
import { userRepo } from '../repositories';
import { IUserModel } from '../types/models/user';
import { repoSession, transaction } from '../decorators';

@service()
export class UserService {
    @transaction()
    public async userCreateTransaction(
        admin: IUserModel, member: IUserModel, @repoSession sess?: never
    ) {
        await userRepo(sess).createOne(admin);
        await userRepo(sess).createOne(member);
    }
}
