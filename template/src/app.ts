import { config } from './config';
import {
    httpServer,
    logger,
    //#module mq_producer|mq_consumer
    mqProducer,
    mqConsumer
    //#endmodule mq_producer|mq_consumer
} from './components';

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
mqProducer.start();
//#endmodule mq_producer
//#module mq_consumer
mqConsumer.start();
//#endmodule mq_consumer

