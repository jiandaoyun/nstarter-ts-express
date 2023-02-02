import _ from 'lodash';

import { Logger } from 'nstarter-core';
import { IQueueMessage, queueConsumerFactory } from 'nstarter-rabbitmq';
import { delayQueue } from '../queue';

/**
 * 延时队列消费示例
 */
export const delayConsumer = queueConsumerFactory(delayQueue, {
    run: async (message: IQueueMessage<string>): Promise<void> => {
        const pushStamp = _.get(message, 'properties.headers.x-p-timestamp') as number;
        Logger.info(`${ message.content }, delay: ${ Date.now() - pushStamp }(ms)`);
    }
});
