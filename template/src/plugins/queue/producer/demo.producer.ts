import _ from 'lodash';
import { ChannelMode, Exchange, ExchangeType, Queue, TaskOptions, TaskPayload } from '../interface';
import { BaseProducer, RabbitMQProducer } from '../queue';

interface DemoPayload extends TaskPayload {
    content: string
}

interface DemoOptions extends TaskOptions {
}

class DemoProducer extends BaseProducer<DemoPayload, DemoOptions> {
    public name = 'producer:demo';
    private readonly _producer = new RabbitMQProducer(ChannelMode.confirm);

    private readonly exchange: Exchange = {
        name: 'demo',
        type: ExchangeType.fanout,
        options: {
            durable: true,
            autoDelete: false,
            internal: false,
            alternateExchange: 'demo:not_routed'
        }
    };

    private readonly queue: Queue = {
        name: '',
        exchange: this.exchange,
        routingKey: '',
        options: {
            exclusive: true,
            durable: false,
            autoDelete: true,
        }
    };

    public init(
        callback: Callback
    ): void {
        this._producer.init((err?: Error) => {
            if (err) {
                return callback(err);
            }
            super.init(callback);
        });
    }

    public produce(message: DemoPayload, options: DemoOptions, callback: Callback): void {
        this._producer.publish(this.queue, message, {
            ...options,
            mandatory: true,
            persistent: true,
            deliveryMode: true
        }, (err?: Error) => {
            if (err) {
                return callback(err);
            }
            return callback();
        });
    }

    public produceDemo(): void {
        this.produce({
            content: Math.random().toString(36).substr(2)
        }, {}, _.noop);
        setTimeout(() => {
            this.produceDemo();
        }, 1000);
    }

    public close(
        callback: Callback
    ): void {
        this._producer.close((err?: Error) => {
            if (err) {
                return callback(err);
            }
            super.close(callback);
        });
    }
}

export const demoProducer = new DemoProducer();
