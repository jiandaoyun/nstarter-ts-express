import { demoConsumer } from './demo.consumer';
import { delayConsumer } from './delay.consumer';

export const loadQueueConsumers = () => {
    demoConsumer.register();
    delayConsumer.register();
};
