import http from 'http';
import express from 'express';
//#module web
import session from 'express-session';
//#module redis
import connectRedis from 'connect-redis';
//#endmodule redis
import cookieParser from 'cookie-parser';
//#endmodule web

import {
    component,
    initRequestId,
    injectComponent,
    RequestLogger,
    ContextProvider,
    BaseComponent,
    Logger
} from 'nstarter-core';
//#module redis
import { RedisComponent } from './redis.component';
//#endmodule redis
//#module i18n
import { I18nComponent } from './i18n.component';
//#endmodule i18n
//#module monitor
import { MonitorComponent } from './monitor.component';
//#endmodule monitor

//#module web
import { config } from '../config';
import { router, securityMiddlewares } from '../routes';
import { ErrorHandler } from '../routes/middlewares/error.handler';
//#endmodule web

@component()
export class HttpServerComponent extends BaseComponent {
    private readonly _server: http.Server;
    //#module monitor
    private readonly _monitor: http.Server;
    //#endmodule monitor

    //#module redis
    @injectComponent()
    private _redisComponent: RedisComponent;
    //#endmodule redis
    //#module i18n
    @injectComponent()
    private _i18nComponent: I18nComponent;
    //#endmodule i18n
    //#module monitor
    @injectComponent()
    private _monitorComponent: MonitorComponent;
    //#endmodule monitor

    constructor() {
        super();

        const app = express();
        app.set('trust proxy', this.trustedProxy);

        //#module web
        // view engine setup
        app.set('views', './views');
        app.set('view engine', 'pug');
        app.enable('view cache');
        // static file path
        app.use(express.static('./public'));

        // session store
        //#module redis
        const RedisStore = connectRedis(session);
        //#endmodule redis
        app.use(session({
            secret: config.server.session.secret,
            name: config.server.session.name,
            resave: false,
            saveUninitialized: false,
            //#module redis
            store: new RedisStore({
                client: this._redisComponent.redis
            }),
            //#endmodule redis
            cookie: config.server.cookie.policy
        }));

        // parser setup
        app.use(express.json({
            limit: '1mb'
        }));
        app.use(express.urlencoded({
            limit: '1mb',
            extended: false
        }));
        app.use(cookieParser());
        app.use(initRequestId());
        //#module i18n
        app.use(this._i18nComponent.i18n.middleware);
        //#endmodule i18n

        // 安全处理
        app.use(securityMiddlewares);

        // 上下文管理
        app.use(ContextProvider.getMiddleware({
            idGenerator: (req) => req.requestId
        }));

        // request log
        if (config.system.req_log.enabled) {
            app.use(RequestLogger.getMiddleware());
        }
        //#module monitor
        app.use(this._monitorComponent.requestMonitorMiddleware);

        const monitorApp = express();
        monitorApp.use(this._monitorComponent.metricsRouter);
        monitorApp.use(this._monitorComponent.healthRouter);
        this._monitor = http.createServer(monitorApp);
        //#endmodule monitor

        app.use('/', router);
        app.use(ErrorHandler.defaultErrorHandler);

        //#endmodule web
        this._server = http.createServer(app);
        // NOTICE: https://github.com/nodejs/node/issues/27363
        this._server.keepAliveTimeout = 70_000;
        this._server.headersTimeout = 71_000;
    }

    public get trustedProxy() {
        let trustedProxy = [
            'loopback',     // 127.0.0.1/8, ::1/128
            'linklocal',    // 169.254.0.0/16, fe80::/10
            'uniquelocal'   // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7
        ];
        if (config.system.trusted_proxy) {
            trustedProxy = [...trustedProxy, ...config.system.trusted_proxy];
        }
        return trustedProxy;
    }

    public get server() {
        return this._server;
    }
    //#module monitor

    public get monitor() {
        return this._monitor;
    }
    //#endmodule monitor

    public async init() {
        const port = config.server.http.port;
        this._server.listen(port);
        this._server.on('error', (err) => {
            Logger.error(err);
            process.exit(1);
        });
        this._server.on('listening', () => {
            Logger.info(`App requests listening on：${ port }`);
        });
        //#module monitor
        // 监控统计服务
        const monitorPort = config.system.monitor.port;
        if (monitorPort) {
            this._monitor.listen(monitorPort);
            this._monitor.on('listening', () => {
                Logger.info(`Monitor requests listening on：${ monitorPort }`);
            });
        }
        //#endmodule monitor
    }

    public async shutdown() {
        Logger.info('web server shutting down');
        this._server.close();
    }
}
