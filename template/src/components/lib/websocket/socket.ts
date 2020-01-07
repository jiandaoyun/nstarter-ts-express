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
import { RedisConnector } from '../database/redis.connection';

const RedisStore = connectRedis(session);

export class WebSocket {
    public static createServer(redis: RedisConnector, server: Server): SocketIO.Server {
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
                                    client: redis.connection
                                }),
                                cookie: config.server.cookie.policy
                            }
                        ))(req, res, callback);
                    }]
                }, (err) => callback(0, !err));
            },
            adapter: SocketIORedis({
                pubClient: redis.connection,
                subClient: redis.connection
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
