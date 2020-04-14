import { Logger } from 'nstarter-core';
import { startQueueConsumers } from 'nstarter-rabbitmq';
import { config } from './config';
import {
    httpServer,
    //#module monitor
    monitorServer, wsServer
    //#endmodule monitor
} from './components';
import {
    startQueueProducer,
    loadQueueConsumers
} from './services/queue.service';

process.on('uncaughtException', (err) => {
    Logger.error(err);
    return false;
});

class AppManager {
    /**
     * Web 服务
     */
    public static startWebService () {
        const port = config.server.http.port;
        httpServer.listen(port);
        httpServer.on('error', (err) => {
            Logger.error(err);
            process.exit(1);
        });
        httpServer.on('listening', () => {
            Logger.info(`Listening on：${ port }`);
        });
    }

    //#module monitor
    /**
     * 监控统计服务
     */
    public static startMonitorService() {
        const monitorPort = config.system.monitor.port;
        if (monitorPort) {
            monitorServer.listen(monitorPort);
            monitorServer.on('listening', () => {
                Logger.info(`Monitor requests listening on：${ monitorPort }`);
            });
        }
    }
    //#endmodule monitor

    //#module mq_consumer|mq_producer
    /**
     * 队列服务
     */
    public static startQueueJobs() {
        //#module mq_producer
        startQueueProducer();
        //#endmodule mq_producer
        //#module mq_consumer
        loadQueueConsumers();
        startQueueConsumers();
        //#endmodule mq_consumer
    }
    //#endmodule mq_consumer|mq_producer

    /**
     * Websocket 服务
     */
    public static startWebsocketService() {
        wsServer.start();
    }
}

if (require.main === module) {
    AppManager.startQueueJobs();
    AppManager.startMonitorService();
    AppManager.startWebService();
    AppManager.startWebsocketService();
}
