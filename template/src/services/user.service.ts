import { service } from 'nstarter-core';
import { repoSession, transaction } from 'nstarter-mongodb';
import { cacheGet, cacheKey } from 'nstarter-cache';
import { userRepo, IUserModel } from '../repositories';
import { userCacheManager } from '../cache';

@service()
export class UserService {
    public async userCreate(user: IUserModel) {
        return userRepo().createOne(user);
    }

    @transaction()
    public async userCreateTransaction(
        admin: IUserModel, member: IUserModel, @repoSession sess?: never
    ) {
        await userRepo(sess).createOne(admin);
        await userRepo(sess).createOne(member);
    }

    @cacheGet(userCacheManager)
    public async findUserByUsername(@cacheKey username: string): Promise<IUserModel> {
        return userRepo().findOneByUsername(username);
    }
}
