import { PongService } from './pong.service';
import { injectSvc, provideSvc } from '../decorators';

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
