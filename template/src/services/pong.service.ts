import { injectSvc, provideSvc } from './container';
import { PingService } from './ping.service';

@provideSvc()
export class PongService {
    @injectSvc()
    private pingService: PingService;

    public pong() {
        console.log('pong');
    }

    public ping() {
        this.pingService.ping();
    }
}
