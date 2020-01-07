import { Logger } from 'nstarter-core';
import { IQueueMessage } from '../../../core/plugins/rabbitmq/types';
import { demoQueue } from '../queue';
import { queueConsumerFactory } from '../../../core/plugins/rabbitmq';

/**
 * 队列任务示例
 */
export const demoConsumer = queueConsumerFactory(demoQueue, {
    run: async (message: IQueueMessage<string>): Promise<void> => {
        Logger.info(message.content as string);
    }
});
