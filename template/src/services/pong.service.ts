import { PingService } from './ping.service';
import { injectService, service } from 'nstarter-core';
//#module apm
import { apmTransaction } from 'nstarter-apm';
//#endmodule apm

@service()
export class PongService {
    @injectService()
    private pingService: PingService;

    public pong() {
        console.log('pong');
    }

    public ping() {
        this.pingService.ping();
    }

    //#module apm
    @apmTransaction()
    public apmTrans() {
        console.log('apm');
    }
    //#endmodule apm
}
