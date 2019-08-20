import { mongodb } from '../src/components';

describe('connectDB', () => {
    //#module mongodb
    before((done) => {
        mongodb.connection.once('open', () => {
            console.log('mongodb connected');
            done();
        });
    });
    //#endmodule mongodb
    it('check', (done) => {
        done()
    });
});
