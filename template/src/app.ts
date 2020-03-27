import { Logger } from 'nstarter-core';
import { startQueueConsumers } from 'nstarter-rabbitmq';
import { config } from './config';
import {
    httpServer,
    //#module monitor
    monitorServer
    //#endmodule monitor
} from './components';
import { startQueueProducer } from './services/queue.service/producer';
import { loadQueueConsumers } from './services/queue.service/consumer';

process.on('uncaughtException', (err) => {
    Logger.error(err);
    return false;
});

const port = config.server.http.port;
httpServer.listen(port);
httpServer.on('error', (err) => {
    Logger.error(err);
    process.exit(1);
});
httpServer.on('listening', () => {
    Logger.info(`Listening on：${ port }`);
});
//#module monitor

const monitorPort = config.system.monitor.port;
if (monitorPort) {
    monitorServer.listen(monitorPort);
    monitorServer.on('listening', () => {
        Logger.info(`Monitor requests listening on：${ monitorPort }`);
    });
}
//#endmodule monitor

//#module mq_consumer
loadQueueConsumers();
startQueueConsumers();
//#endmodule mq_consumer

//#module mq_producer
startQueueProducer();
//#endmodule mq_producer
