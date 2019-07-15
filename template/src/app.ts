import { config } from './config';
import { httpServer, logger } from './components';

const port = config.server.http.port;
httpServer.listen(port);
httpServer.on('error', (err) => {
    logger.error(err);
    process.exit(1);
});
httpServer.on('listening', () => {
    logger.info(`Listening on：${ port }`);
});

//#module mq_producer
import { mqProducer } from './components';
mqProducer.start();
//#endmodule mq_producer

//#module mq_consumer
import { mqConsumer } from './components';
mqConsumer.start();
//#endmodule mq_consumer
