import { BaseService } from './base.service';
import { server } from '../server';
import { config } from '../config';
import { logger } from '../logger';
import { Services } from './enum';

export class HttpService extends BaseService {
    public name = Services.http;
    public wanted = [
        //#module i18n
        Services.i18n,
        //#endmodule i18n
        //#module mongodb
        Services.mongodb,
        //#endmodule mongodb
        //#module redis
        Services.redis,
        //#endmodule redis
        //#module websocket
        Services.websocket
        //#endmodule websocket
    ];

    public start (callback: Function) {
        const port = config.server.http.port;
        server.listen(port);
        server.on('error', (err) => {
            logger.error(err);
            process.exit(1);
        });
        server.on('listening', () => {
            this.log(`Listening on：${ port }`);
            return super.start(callback);
        });
    }

    public stop (callback: Function) {
        server.close();
        return super.stop(callback);
    }
}

export const httpService = new HttpService();
