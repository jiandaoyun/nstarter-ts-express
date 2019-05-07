import chai from 'chai';
import mocha from 'mocha';
import { UserService } from '../../../src/services';
import { userModel, User } from '../../../src/models/user.model';

const should = chai.should();

describe('UserService', () => {
    const testUser: User = {
        username: 'test',
        nickname: 'test',
        email: 'test@163.com',
        password: '!passw0rd',
        salt: 'sa1t'
    };

    it('createOne', (done) => {
        UserService.createOne(testUser, (err: Error, userDoc: any) => {
            should.not.exist(err);
            should.exist(userDoc);
            return done();
        });
    });

    it('findOneByUsername', (done) => {
        UserService.findOneByUsername(testUser.username, (err: Error, user: User) => {
            should.not.exist(err);
            should.exist(user);
            user.username.should.equal(testUser.username);
            return done();
        });
    });

    after((done) => {
        userModel.deleteMany({
            username: testUser.username
        }, (err) => {
            should.not.exist(err);
            return done();
        });
    });
});
