import chai from 'chai';
import { pingService, pongService } from '../../../src/services';

const should = chai.should();

describe('Circular Call', () => {
    it('PingPong', async () => {
        try {
            pingService.ping();
            pingService.pong();

            pongService.ping();
            pongService.pong();
        } catch (err) {
            should.not.exist(err);
        }
    });
});
