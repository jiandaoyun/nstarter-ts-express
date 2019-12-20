import _ from 'lodash';
import { DelayLevel } from '../lib/constants';
import { RabbitMQProducer } from '../lib/rabbitmq.producer';
import { IProduceOptions } from '../lib/types';
import { delayProducer, demoProducer } from './demo.producer';

const producerList: RabbitMQProducer<any>[] = [
    demoProducer,
    delayProducer
];

export class QueueProducer {
    public static async start(): Promise<void> {
        await Promise.all(_.map(producerList,
            (producer: RabbitMQProducer<any>) => producer.waitForSetup()
        ));
        for (let i = 0; i < 10; i++) {
            await QueueProducer.pushNormal('demo:normal' + i);
            await QueueProducer.pushDelay('demo:delay' + i, {
                pushDelay: _.get(DelayLevel, `level${ i }`)
            });
        }
        return;
    }

    public static async stop(): Promise<void> {
        await Promise.all(_.map(producerList, (producer) => producer.close()));
        return;
    }

    public static async pushNormal(
        content: any
    ): Promise<void> {
        await demoProducer.publish(content);
        return;
    }

    public static async pushDelay(
        content: any,
        options?: Partial<IProduceOptions>
    ): Promise<void> {
        await delayProducer.publish(content, options);
        return;
    }
}
