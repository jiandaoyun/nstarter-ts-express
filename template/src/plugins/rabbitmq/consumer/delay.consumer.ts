import _ from 'lodash';

import { delayQueue } from '../queue';
import { IQueueMessage } from '../../../core/plugins/rabbitmq/types';
import { logger } from '../../../components';
import { queueConsumerFactory } from '../../../core/plugins/rabbitmq';

/**
 * 延时队列消费示例
 */
export const delayConsumer = queueConsumerFactory(delayQueue, {
    run: async (message: IQueueMessage<string>): Promise<void> => {
        const pushStamp = _.get(message, 'properties.headers.x-p-timestamp');
        logger.info(`${ message.content }, delay: ${ Date.now() - pushStamp }(ms)`);
    }
});
