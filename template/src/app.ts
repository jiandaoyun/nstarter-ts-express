import { Logger } from 'nstarter-core';
import './schema';
//#module apm
import { apmConnector } from 'nstarter-apm';
import { apm } from './apm';
//#endmodule apm
import {
    //#module mongodb
    mongodbComponent,
    //#endmodule mongodb
    //#module web
    httpServerComponent,
    //#endmodule web
    //#module ws_server
    wsServerComponent,
    //#endmodule ws_server
    //#module rabbitmq
    rabbitMqComponent,
    //#endmodule rabbitmq
    //#module redis
    redisComponent,
    //#endmodule redis
    //#module monitor
    monitorComponent,
    //#endmodule monitor
    //#module grpc_server
    grpcServer,
    //#endmodule grpc_server
    //#module i18n
    i18n
    //#endmodule i18n
} from './components';
//#module rabbitmq
import { startQueueConsumers } from 'nstarter-rabbitmq';
import { startQueueProducer, loadQueueConsumers } from './services/queue.service';
//#endmodule rabbitmq
//#module cron
import { startCronJobs } from './services/cron.service';
//#endmodule cron
import { CommonUtils } from './utils';
import { Consts } from './constants';

process.on('uncaughtException', (err) => {
    Logger.error(err);
    return false;
});

class AppManager {
    //#module rabbitmq
    /**
     * 队列服务
     */
    public static async startQueueJobs() {
        await rabbitMqComponent.init();
        loadQueueConsumers();
        await startQueueConsumers();
        await startQueueProducer();
    }
    //#endmodule rabbitmq

    /**
     * 安全关闭服务
     */
    public static async gracefulShutdown() {
        //#module monitor
        monitorComponent.setShutdownState();
        //#endmodule monitor
        // 等待 readinessProbe 进入 fail 状态
        await CommonUtils.sleep(Consts.System.SHUTDOWN_WAIT_MS);
        try {
            // 按顺序停止服务
            //#module web
            await httpServerComponent.shutdown();
            //#endmodule web
            //#module ws_server
            await wsServerComponent.shutdown();
            //#endmodule ws_server
            //#module grpc_server
            await grpcServer.shutdown();
            //#endmodule grpc_server
            //#module rabbitmq
            await rabbitMqComponent.shutdown();
            //#endmodule rabbitmq
            //#module mongodb
            await mongodbComponent.shutdown();
            //#endmodule mongodb
            //#module redis
            await redisComponent.shutdown();
            //#endmodule redis
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

    public static async start() {
        //#module apm
        apm.isStarted();
        apmConnector.setApmAgent(apm);
        //#endmodule apm

        // 基础组件
        //#module mongodb
        await mongodbComponent.init();
        //#endmodule mongodb
        //#module i18n
        await i18n.init();
        //#endmodule i18n

        // 任务调度
        //#module rabbitmq
        await AppManager.startQueueJobs();
        //#endmodule rabbitmq
        //#module cron
        await startCronJobs();
        //#endmodule cron

        // 网络服务
        //#module web
        await httpServerComponent.init();
        //#endmodule web
        //#module ws_server
        await wsServerComponent.init();
        //#endmodule ws_server
        //#module grpc_server
        await grpcServer.init();
        //#endmodule grpc_server

        // 监听关闭事件
        AppManager.listenShutdownEvent();
    }
}

if (require.main === module) {
    AppManager.start().then();
}
