import { AbstractComponent } from './abstract.component';
import { RabbitMQComponent } from './rabbitmq.component';
import { injectComponent, provideComponent } from '../decorators';
import { logger } from './lib/logger';

@provideComponent()
export class MQProducerComponent extends AbstractComponent {
    @injectComponent()
    private _rabbitMqComponent: RabbitMQComponent;

    constructor() {
        super();
        this.log();
    }

    public async start(): Promise<void> {
        try {
            await this._rabbitMqComponent.waitForConnect();
            const { QueueProducer } = require('../plugins/queue/producer');
            await QueueProducer.start();
            logger.info('mq producer start ... ok');
        } catch (err) {
            logger.error(err);
        }
    }

    public async stop(): Promise<void> {
        try {
            const { QueueProducer } = require('../plugins/queue/producer');
            await QueueProducer.stop();
            logger.info('mq producer stop ... ok');
        } catch (err) {
            logger.error(err);
        }
    }
}
