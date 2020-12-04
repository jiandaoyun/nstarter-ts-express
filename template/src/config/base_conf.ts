// WARNING: THIS IS A DEMO CONFIG FILE. FOR SECURITY REASONS, DO NOT USE THIS
//          FILE TO CONFIG YOUR APPLICATION.
export const baseConf = {
    server: {
        http: {
            port: 3000
        },
        //#module web
        static: {
            views: './views',
            public: './public'
        },
        session: {
            secret: '!passw0rd',
            name: 'SID'
        },
        //#endmodule web
        cookie: {
            secret: '!passw0rd',
            policy: {
                httpOnly: true,
                signed: true,
                secure: false
            }
        }
    },
    database: {
        //#module mongodb
        mongodb: {
            servers: [{
                host: 'localhost',
                port: 27017
            }],
            user: 'admin',
            password: '!passw0rd',
            db: 'data'
        },
        //#endmodule mongodb
        //#module redis
        redis: {
            name: 'redis',
            host: 'localhost',
            port: 6379,
            password: '!passw0rd'
        },
        //#endmodule redis
    },
    system: {
        //#module i18n
        locale: 'en_us',
        //#endmodule i18n
        timezone: 'UTC',
        log: {
            console: {
                enabled: true,
                level: 'info',
                colorize: false
            },
            file: {
                enabled: true,
                level: 'info',
                dir: './log/',
                zip: true,
                rotate_days: 14
            },
            //#module graylog
            graylog: {
                enabled: false,
                level: 'info',
                servers: [{
                    host: 'localhost',
                    port: 12201
                }]
            },
            //#endmodule graylog
            //#module sentry
            sentry: {
                enabled: false,
                level: 'warn',
                dsn: ''
            },
            //#endmodule sentry
        },
        req_log: {
            enabled: true
        },
        //#module monitor
        monitor: {
            port: 3001,
            metric_path: '/metrics',
            health_path: '/health_check'
        },
        //#endmodule monitor
        trusted_proxy: []
    },
    components: {
        //#module rabbitmq
        rabbitmq: {
            brokers: [
                {
                    host: 'localhost',
                    port: 5672
                }
            ],
            protocol: 'amqp',
            user: 'guest',
            password: '!passw0rd',
            vhost: '/'
        },
        //#endmodule rabbitmq
        //#module grpc
        grpc: {
            server: {
                port: 9050
            },
            clients: [{
                package: 'worker',
                address: 'localhost:9050'
            }]
        },
        //#endmodule grpc
    }
};
