import http from 'http';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';

import { router } from './routes';
import { config } from './config';
import { Database } from './database';

export const app = express();

// view engine setup
app.set('views', config.server.static.views);
app.set('view engine', 'pug');

// static file path
app.use(express.static(config.server.static.public));

// session store
const RedisStore = connectRedis(session);
app.use(session({
    secret: config.server.session.secret,
    name: config.server.session.name,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        client: Database.redis.connection
    }),
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

app.use('/', router);

// start http server
export const server = http.createServer(app);
const port = config.server.http.port;
server.listen(port);
server.on('error', (err) => {
    console.error(err.stack);
    process.exit(1);
});
server.on('listening', () => {
    console.log(`Listening on：${ port }`);
});
