import { Logger } from 'nstarter-core';
import { startQueueConsumers } from 'nstarter-rabbitmq';
import { config } from './config';
import {
    httpServer,
    httpServerComponent,
    //#module monitor
    monitorServer,
    wsServer,
    rabbitMqComponent,
    redisComponent,
    mongodbComponent,
    monitorComponent,
    wsServerComponent
    //#endmodule monitor
} from './components';
import {
    startQueueProducer,
    loadQueueConsumers
} from './services/queue.service';
import { CommonUtils } from './utils';
import { Consts } from './constants';

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

        process.on('SIGTERM', () => {
            setTimeout(() => {
                Logger.info('calling server close');
                process.exit(0);
            }, 5000);
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

    /**
     * 安全关闭服务
     */
    public static async gracefulShutdown() {
        monitorComponent.setShutdownState();
        // 等待 readinessProbe 进入 fail 状态
        await CommonUtils.sleep(Consts.System.SHUTDOWN_WAIT_MS);
        try {
            // 按顺序停止服务
            await httpServerComponent.shutdown();
            await wsServerComponent.shutdown();
            await rabbitMqComponent.shutdown();
            await mongodbComponent.shutdown();
            await redisComponent.shutdown();
        } catch (err) {
            Logger.error(err);
        } finally {
            process.exit(0);
        }
    }

    /**
     * 监听关闭事件，安全退出
     */
    public static listenShutdownEvent() {
        process.on('SIGTERM', async () => {
            await AppManager.gracefulShutdown();
        });
    }
}

if (require.main === module) {
    AppManager.startQueueJobs();
    AppManager.startMonitorService();
    AppManager.startWebService();
    AppManager.startWebsocketService();
    AppManager.listenShutdownEvent();
}
