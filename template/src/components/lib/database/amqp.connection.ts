import _ from 'lodash';
import AmqpConnectManager, { AmqpConnectionManager } from 'amqp-connection-manager';
import { RabbitMQConfig } from '../../../types/config/database.config';
import { logger } from '../logger';

export class AmqpConnector {
    public connection: AmqpConnectionManager;
    private readonly _options: RabbitMQConfig;
    private readonly _name?: string;

    constructor(options: RabbitMQConfig, name?: string) {
        this._options = options;
        if (name) {
            this._name = name;
        }
        const { heartbeatInterval, reconnectInterval } = this._options;
        this.connection = AmqpConnectManager.connect(this.amqpUrls, {
            heartbeatIntervalInSeconds: heartbeatInterval,
            reconnectTimeInSeconds: reconnectInterval
        });
        this.connection.once('connect', () => {
            this.connection.on('disconnect', (err?: Error) => {
                if (err) {
                    logger.error(`${ this._tag } disconnected`);
                }
            });
        });
    }

    private get amqpUrls(): string[] {
        const { user, password, protocol, brokers } = this._options,
            vhost = encodeURIComponent(this._options.vhost || '/');
        return _.map(brokers, (broker) => {
            const { host, port = 5672 } = broker;
            return `${ protocol }://${ user }:${ password }@${ host }:${ port }/${ vhost }`;
        });
    }

    private get _tag(): string {
        return `RabbitMQ${ this._name ? `:${ this._name }` : '' }`;
    }
}

