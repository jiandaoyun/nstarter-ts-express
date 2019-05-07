import http from 'http';
import express from 'express';
import session = require('express-session');
import connectRedis = require('connect-redis');
import cookieParser = require('cookie-parser');

import { BaseComponent } from './base.component';
import { lazyInject, provideComponent } from './container';
import { RedisComponent } from './redis.component';
import { I18nComponent } from './i18n.component';
import { LoggerComponent } from './logger.component';

import { config } from '../config';
import { router } from '../routes';

@provideComponent()
export class HttpServerComponent extends BaseComponent {
    private _server: http.Server;

    @lazyInject(RedisComponent)
    private _redisComponent: RedisComponent;

    @lazyInject(I18nComponent)
    private _i18nComponent: I18nComponent;

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

        app.use('/', router);
        //#endmodule web
        this._server = http.createServer(app);
    }

    public get server () {
        return this._server;
    }
}
