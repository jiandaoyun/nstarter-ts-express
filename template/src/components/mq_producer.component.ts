import async from 'async';
import { AbstractComponent } from './abstract.component';
import { RabbitMQComponent } from './rabbitmq.component';
import { lazyInject, provideComponent } from './container';
import { demoProducer } from '../plugins/queue';
import { logger } from './index';

@provideComponent()
export class MQProducerComponent extends AbstractComponent {
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
            // 发送消息
            produce: ['initProducer', (results, callback) => {
                demoProducer.produceDemo();
                return callback();
            }]
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('mq producer start ... ok');
            }
        });
    }

    public stop(): void {
        async.auto<any>({
            stopProducer: (callback) =>
                demoProducer.close(callback)
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('mq producer stop ... ok');
            }
        });
    }
}
