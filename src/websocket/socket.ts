import _, { Dictionary } from 'lodash';
import async from 'async';
import SocketIO from 'socket.io';
import SocketIORedis from 'socket.io-redis';
import cookieParser from 'cookie-parser';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { ServerResponse } from 'http';
import { Response } from 'express';

import { server } from '../server';
import { config } from '../config';
import Database from '../database';

import channels from './channels';

const RedisStore = connectRedis(session);

class WebSocket {
    public static createServer(): SocketIO.Server {
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
                        cookieParser(config.server.cookie.secret)(req, res, callback);
                    },
                    // load session
                    session: ['cookie', (results, callback) => {
                        session(_.extend(
                            config.server.session,
                            {
                                store: new RedisStore({
                                    client: Database.redis.connection
                                }),
                                cookie: config.server.cookie.policy
                            }
                        ))(req, res, callback);
                    }]
                }, (err) => callback(0, !err));
            },
            adapter: SocketIORedis({
                pubClient: Database.redis.connection,
                subClient: Database.redis.connection
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
                    // TODO logger
                });
                return;
            });
        });

        return io;
    }
}

export = WebSocket;
