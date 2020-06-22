import _, { Dictionary } from 'lodash';
import { Server, ServerResponse } from 'http';
import async from 'async';
import SocketIO from 'socket.io';
import SocketIORedis from 'socket.io-redis';
import cookieParser from 'cookie-parser';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { Response } from 'express';
import { Logger } from 'nstarter-core';

import { config } from '../../../config';

import { channels } from './channels';
import { Redis } from 'ioredis';

const RedisStore = connectRedis(session);

export class WebSocket {
    public static createServer(redis: Redis, server: Server): SocketIO.Server {
        const buildCookie = cookieParser(config.server.cookie.secret);
        const buildSession = session(_.extend(
            config.server.session,
            {
                resave: true,
                saveUninitialized: true,
                store: new RedisStore({
                    client: redis
                }),
                cookie: config.server.cookie.policy
            }
        ));
        const io = SocketIO(server, {
            path: '/socket',
            serveClient: false,
            origins: '*:*',
            transports: ['websocket'],
            allowRequest: (req, callback) => {
                const res = new ServerResponse(req) as Response;
                async.auto<Dictionary<never>, Error>({
                    // load cookies
                    cookie: (callback) => {
                        buildCookie(req, res, callback);
                    },
                    // load session
                    session: ['cookie', (results, callback) => {
                        buildSession(req, res, callback);
                    }]
                }, (err) => callback(0, !err));
            },
            adapter: SocketIORedis({
                pubClient: redis,
                subClient: redis
            })
        });

        io.on('connection', (socket) => {
            async.mapSeries(channels, (channel, callback) => {
                channel.connect(socket, callback);
            }, (err, roomKeys) => {
                if (err || _.isEmpty(roomKeys)) {
                    return socket.disconnect();
                }
                socket.on('error', (err) => {
                    Logger.error(err);
                });
                return;
            });
        });

        return io;
    }
}
