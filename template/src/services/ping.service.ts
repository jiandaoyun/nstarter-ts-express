import { injectSvc, provideSvc } from './container';
import { PongService } from './pong.service';

@provideSvc()
export class PingService {
    @injectSvc()
    private pongService: PongService;

    public ping() {
        console.log('ping');
    }

    public pong () {
        this.pongService.pong();
    }
}
