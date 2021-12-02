import { ContextProvider, Logger } from 'nstarter-core';
import { IQueueMessage, queueConsumerFactory } from 'nstarter-rabbitmq';
import { demoQueue } from '../queue';

/**
 * 队列任务示例
 */
export const demoConsumer = queueConsumerFactory(demoQueue, {
    run: async (message: IQueueMessage<string>): Promise<void> => {
        const context = ContextProvider.getContext();
        // 获取任务上下文
        if (context) {
            Logger.info(`job context: ${ context.traceId }`);
        }
        Logger.info(message.content as string);
    }
});
