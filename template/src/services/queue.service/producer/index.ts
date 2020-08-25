import async from 'async';
import { service } from 'nstarter-core';
import { ProducerEvents, RabbitMqProducer } from 'nstarter-rabbitmq';

import { demoProducer } from './demo.producer';
import { delayProducer } from './delay.producer';
import { monitor } from '../../../components';

const producerList: RabbitMqProducer<any>[] = [
    demoProducer,
    delayProducer
];

/**
 * 绑定生产事件监听
 */
export const listenProducerEvents = (producer: RabbitMqProducer<any>) => {
    const queueName = producer.queue.name;
    producer.on(ProducerEvents.publish, () => {
        monitor.incQueueJobCount(queueName, 'publish');
    });
};

/**
 * 队列生产者启动方法
 */
export const startQueueProducer = async () => {
    await async.each(producerList, async (producer) => {
        await producer.setup();
        listenProducerEvents(producer);
    });
};

/**
 * 队列业务调用服务
 */
@service()
export class QueueService {
    public async sendNormalMessage(): Promise<void> {
        await demoProducer.publish('demo:normal');
    }

    public async sendDelayMessage(): Promise<void> {
        await delayProducer.publish('demo:delay');
    }
}
