import { config } from './config';
import { httpServer, logger, queue } from './components';

const port = config.server.http.port;
httpServer.listen(port);
httpServer.on('error', (err) => {
    logger.error(err);
    process.exit(1);
});
httpServer.on('listening', () => {
    logger.info(`Listening on：${ port }`);
});

//#module queue
queue.start();
//#endmodule queue
