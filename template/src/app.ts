import { config } from './config';
import { server } from './server';
import { logger } from './components/lib/logger';

const port = config.server.http.port;
server.listen(port);
server.on('error', (err) => {
    logger.error(err);
    process.exit(1);
});
server.on('listening', () => {
    logger.info(`Listening on：${ port }`);
});
