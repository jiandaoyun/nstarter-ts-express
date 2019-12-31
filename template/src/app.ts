import { config } from './config';
import {
    httpServer,
    //#module monitor
    monitorServer,
    //#endmodule monitor
    logger
} from './components';
import { startQueueProducer, startQueueConsumer } from './plugins/rabbitmq';

process.on('uncaughtException', (err) => {
    logger.error(err);
    return false;
});

const port = config.server.http.port;
httpServer.listen(port);
httpServer.on('error', (err) => {
    logger.error(err);
    process.exit(1);
});
httpServer.on('listening', () => {
    logger.info(`Listening on：${ port }`);
});
//#module monitor

const monitorPort = config.system.monitor.port;
if (monitorPort) {
    monitorServer.listen(monitorPort);
    monitorServer.on('listening', () => {
        logger.info(`Monitor requests listening on：${ monitorPort }`);
    });
}
//#endmodule monitor

//#module mq_producer
startQueueProducer();
//#endmodule mq_producer
//#module mq_consumer
startQueueConsumer();
//#endmodule mq_consumer
