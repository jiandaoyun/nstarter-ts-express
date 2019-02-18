import http from 'http';
//#module redis
import connectRedis from 'connect-redis';
//#endmodule redis
import express from 'express';
//#module web
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { router } from './routes';
//#endmodule web
import { config } from './config';
//#module redis
import { Database } from './database';
//#endmodule redis
//#module i18n
import { i18n } from './i18n';
//#endmodule i18n
import { reqLogger } from './logger';

export const app = express();
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
        client: Database.redis.connection
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
app.use(i18n.middleware);
//#endmodule i18n

// request log
if (config.system.req_log.enabled) {
    app.use(reqLogger.middleware);
}

app.use('/', router);
//#endmodule web

export const server = http.createServer(app);
