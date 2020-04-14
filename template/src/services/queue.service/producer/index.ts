import _ from 'lodash';
import { provideSvc } from 'nstarter-core';
import { IQueueProducer } from 'nstarter-rabbitmq';

import { demoProducer } from './demo.producer';
import { delayProducer } from './delay.producer';
import { QueueConsts } from '../../../constants';

const producerList: IQueueProducer<any>[] = [
    demoProducer,
    delayProducer
];

/**
 * 队列生产者启动方法
 */
export const startQueueProducer = async () => {
    await Promise.all(_.map(producerList,
        (producer: IQueueProducer<any>) => producer.setup()
    ));
    return;
};

/**
 * 队列业务调用服务
 */
@provideSvc()
export class QueueService {
    public async sendNormalMessage(): Promise<void> {
        await demoProducer.publish('demo:normal');
    }

    public async sendDelayMessage(): Promise<void> {
        await delayProducer.publish('demo:delay', {
            pushDelay: QueueConsts.DelayLevel.level1
        });
    }
}
