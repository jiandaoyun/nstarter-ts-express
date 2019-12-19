import { delayConsumer, IQueueConsumer, normalConsumer } from './demo.consumer';
import _ from 'lodash';

const consumerList: IQueueConsumer[] = [
    delayConsumer,
    normalConsumer
];

export class QueueConsumer {
    public static async start(): Promise<void> {
        await Promise.all(_.map(consumerList,
            (consumer: IQueueConsumer) => consumer.startConsumer()
        ));
        return;
    }

    public static async stop(): Promise<void> {
        await Promise.all(_.map(consumerList, (consumer) => consumer.stopConsumer()));
        return;
    }
}
