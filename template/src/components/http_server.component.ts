import http from 'http';
import express from 'express';
//#module web
import session from 'express-session';
//#module redis
import connectRedis from 'connect-redis';
//#endmodule redis
import cookieParser from 'cookie-parser';
//#endmodule web

import { AbstractComponent } from './abstract.component';
import { lazyInject, provideComponent } from './container';
//#module redis
import { RedisComponent } from './redis.component';
//#endmodule redis
//#module i18n
import { I18nComponent } from './i18n.component';
//#endmodule i18n
//#module monitor
import { MonitorComponent } from './monitor.component';
//#endmodule monitor
import { LoggerComponent } from './logger.component';

//#module web
import { config } from '../config';
import { router } from '../routes';
//#endmodule web

@provideComponent()
export class HttpServerComponent extends AbstractComponent {
    private _server: http.Server;

    //#module redis
    @lazyInject(RedisComponent)
    private _redisComponent: RedisComponent;
    //#endmodule redis
    //#module i18n
    @lazyInject(I18nComponent)
    private _i18nComponent: I18nComponent;
    //#endmodule i18n
    //#module monitor
    @lazyInject(MonitorComponent)
    private _monitorComponent: MonitorComponent;
    //#endmodule monitor

    @lazyInject(LoggerComponent)
    private _loggerComponent: LoggerComponent;

    constructor() {
        super();

        const app = express();
        app.enable('trust proxy');

        //#module web
        // view engine setup
        app.set('views', config.server.static.views);
        app.set('view engine', 'pug');
        // static file path
        app.use(express.static(config.server.static.public));

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
                client: this._redisComponent.redis.connection
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
        //#module i18n
        app.use(this._i18nComponent.i18n.middleware);
        //#endmodule i18n

        // request log
        if (config.system.req_log.enabled) {
            app.use(this._loggerComponent.reqLogger.middleware);
        }
        //#module monitor

        app.use(this._monitorComponent.requestMonitorMiddleware);
        app.use(this._monitorComponent.metricsRouter);
        //#endmodule monitor

        app.use('/', router);
        //#endmodule web
        this._server = http.createServer(app);
    }

    public get server () {
        return this._server;
    }
}
