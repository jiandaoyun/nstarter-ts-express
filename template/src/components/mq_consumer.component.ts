import { AbstractComponent } from './abstract.component';
import { RabbitMQComponent } from './rabbitmq.component';
import { logger } from './lib/logger';
import { injectComponent, provideComponent } from '../decorators';

@provideComponent()
export class MQConsumerComponent extends AbstractComponent {
    @injectComponent()
    private _rabbitMqComponent: RabbitMQComponent;

    constructor() {
        super();
        this.log();
    }

    public async start(): Promise<void> {
        try {
            await this._rabbitMqComponent.waitForConnect();
            const { QueueConsumer } = require('../plugins/queue/consumer');
            await QueueConsumer.start();
            logger.info('mq consumer start ... ok');
        } catch (err) {
            logger.error(err);
        }
    }

    public async stop(): Promise<void> {
        try {
            const { QueueConsumer } = require('../plugins/queue/consumer');
            await QueueConsumer.start();
            logger.info('mq consumer stop ... ok');
        } catch (err) {
            logger.error(err);
        }
    }
}
