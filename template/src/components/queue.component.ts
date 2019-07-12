import async from 'async';
import { AbstractComponent } from './abstract.component';
import { RabbitMQComponent } from './rabbitmq.component';
import { lazyInject, provideComponent } from './container';
import { demoProducer, demoConsumer, demoSubscribe } from '../plugins/queue';
import { logger } from './index';

@provideComponent()
export class QueueComponent extends AbstractComponent {
    @lazyInject(RabbitMQComponent)
    private _rabbitmqComponent: RabbitMQComponent;

    constructor() {
        super();
        this.log();
    }

    public start(): void {
        async.auto<any>({
            // 连接 RabbitMQ Server
            prepare: (callback) => {
                this._rabbitmqComponent
                    .rabbitmq
                    .connect(callback);
            },
            // 创建 Demo 生产者
            initProducer: ['prepare', (results, callback) =>
                demoProducer.init(callback)
            ],
            // 创建 Demo 消费者
            initConsumer: ['prepare', (results, callback) =>
                demoConsumer.init(callback)
            ],
            initSubscribe: ['prepare', (results, callback) =>
                demoSubscribe.init(callback)
            ],
            // 发送消息
            produce: ['initProducer', (results, callback) => {
                demoProducer.produceDemo();
                return callback();
            }],
            // PULL 模式接受消息
            consume: ['initConsumer', (results, callback) => {
                demoConsumer.consume();
                return callback();
            }],
            // PUSH 模式接受消息
            subscribe: ['initSubscribe', (results, callback) => {
                demoSubscribe.consume();
                return callback();
            }]
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('queue start ... ok');
            }
        });
    }

    public stop(): void {
        async.auto<any>({
            stopProducer: (callback) =>
                demoProducer.close(callback),
            stopConsumer: (callback) =>
                demoConsumer.close(callback),
            stopSubscribe: (callback) =>
                demoSubscribe.close(callback)
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('queue stop ... ok');
            }
        });
    }
}
