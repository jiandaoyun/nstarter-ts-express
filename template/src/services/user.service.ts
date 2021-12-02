import { service } from 'nstarter-core';
import { repoSession, transaction } from 'nstarter-mongodb';
import { userRepo, IUserModel } from '../repositories';

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
