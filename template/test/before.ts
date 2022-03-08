//#module mongodb
import { mongodb } from '../src/components';
//#endmodule mongodb

describe('connectDB', () => {
    //#module mongodb
    before((done) => {
        mongodb.once('open', () => {
            console.log('mongodb connected');
            done();
        });
    });
    //#endmodule mongodb
    it('check', (done) => {
        done()
    });
});
