import { PingService } from './ping.service';
import { injectSvc, provideSvc } from '../decorators';

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
