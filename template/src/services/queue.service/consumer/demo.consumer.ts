import { Logger } from 'nstarter-core';
import { IQueueMessage, queueConsumerFactory } from 'nstarter-rabbitmq';
import { demoQueue } from '../queue';

/**
 * 队列任务示例
 */
export const demoConsumer = queueConsumerFactory(demoQueue, {
    run: async (message: IQueueMessage<string>): Promise<void> => {
        Logger.info(message.content as string);
    }
});
