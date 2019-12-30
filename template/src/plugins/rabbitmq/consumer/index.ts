import _ from 'lodash';
import { IQueueConsumer } from '../../../core/plugins/rabbitmq';
import { demoConsumer } from './demo.consumer';
import { delayConsumer } from './delay.consumer';

const consumerList: IQueueConsumer<any>[] = [
    delayConsumer,
    demoConsumer
];

/**
 * 队列消费者启动方法
 */
export const startQueueConsumer = async(): Promise<void> => {
    await Promise.all(_.map(consumerList,
        (consumer: IQueueConsumer<any>) => consumer.start()
    ));
    return;
};
