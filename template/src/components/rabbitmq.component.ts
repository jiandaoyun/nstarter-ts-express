import { config } from '../config';
import { AbstractComponent } from './abstract.component';
import { AmqpConnector } from './lib/database/amqp.connection';
import { provideComponent } from '../decorators';

@provideComponent()
export class RabbitMQComponent extends AbstractComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.database.rabbitmq);
        this.log();
    }

    public get amqp(): AmqpConnector {
        return this._amqp;
    }

    public async waitForConnect(): Promise<void> {
        const { connection } = this._amqp;
        if (connection.isConnected()) {
            return;
        }
        return new Promise((resolve) => {
            connection.once('connect', () => resolve());
        });
    }
}
