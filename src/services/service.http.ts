import { BaseService } from './service.base';
import { server } from '../server';
import { config } from '../config';
import { logger } from '../logger';
import { Services } from './enum';

export class HttpService extends BaseService {
    public name = Services.http;
    public wanted = [
        Services.i18n,
        Services.mongodb,
        Services.redis
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
        server.close(() => {
            return super.stop(callback);
        });
    }
}

export const httpService = new HttpService();
