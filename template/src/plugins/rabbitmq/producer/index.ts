import _ from 'lodash';
import { demoProducer } from './demo.producer';
import { delayProducer } from './delay.producer';
import { DelayLevel, IQueueProducer } from '../../../core/plugins/rabbitmq';

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
 * 队列任务创建示例
 */
const produceDemo = async () => {
    await demoProducer.publish('demo:normal');
    await delayProducer.publish('demo:delay', {
        pushDelay: DelayLevel.level1
    });
};

produceDemo();
