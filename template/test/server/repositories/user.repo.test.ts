import chai from 'chai';
import mocha from 'mocha';
import { userRepo, IUserModel } from '../../../src/repositories';
import { userModel } from '../../../src/models/user.model';

const should = chai.should();

describe('UserRepo', () => {
    const testUser: IUserModel = {
        username: 'test',
        nickname: 'test',
        email: 'test@163.com',
        password: '!passw0rd',
        salt: 'sa1t'
    };

    it('createOne', async () => {
        try {
            const newUser = await userRepo().createOne(testUser);
            should.exist(newUser);
        } catch (err) {
            should.not.exist(err);
        }
    });

    it('findOneByUsername', async () => {
        try {
            const user = await userRepo().findOneByUsername(testUser.username);
            should.exist(user);
            user.username.should.equal(testUser.username);
        } catch (err) {
            should.not.exist(err);
        }
    });

    after(async () => {
        try {
            await userModel.deleteMany({
                username: testUser.username
            });
        } catch (err) {
            should.not.exist(err);
        }
    });
});
