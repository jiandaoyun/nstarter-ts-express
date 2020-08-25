import { PongService } from './pong.service';
import { injectService, service } from 'nstarter-core';

@service()
export class PingService {
    @injectService()
    private pongService: PongService;

    public ping() {
        console.log('ping');
    }

    public pong () {
        this.pongService.pong();
    }
}
