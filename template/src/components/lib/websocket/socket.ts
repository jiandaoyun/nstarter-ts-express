import _, { Dictionary } from 'lodash';
import { Server, ServerResponse } from 'http';
import async from 'async';
import { IRedis } from 'nstarter-redis';
import SocketIO from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import cookieParser from 'cookie-parser';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'nstarter-core';

import { config } from '../../../config';

import { channels } from './channels';

const RedisStore = connectRedis(session);

export class WebSocket {
    public static createServer(redis: IRedis, server: Server): SocketIO.Server {
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
        const io = new SocketIO.Server(server, {
            path: '/socket',
            serveClient: false,
            cors: {
                origin: '*:*'
            },
            transports: ['websocket'],
            allowRequest: (req, callback) => {
                const res = new ServerResponse(req) as Response;
                async.auto<Dictionary<never>, Error>({
                    // 加载 cookies
                    cookie: (callback) => {
                        buildCookie(req as Request, res, callback as NextFunction);
                    },
                    // 加载 session
                    session: ['cookie', (results, callback ) => {
                        buildSession(req as Request, res, callback as NextFunction);
                    }]
                }, (err) => callback(null, !err));
            },
            // subscribe 模式不能共享同一个 Redis 连接，使用独立连接实例
            adapter: createAdapter(redis, redis.duplicate())
        });

        io.on('connection', async (socket) => {
            const roomKeys = [];
            for (const channel of channels) {
                try {
                    const roomKey = await channel.connect(socket);
                    if (roomKey) {
                        roomKeys.push(roomKey);
                    }
                } catch(err) {
                    // 不处理异常
                }
            }
            if (_.isEmpty(roomKeys)) {
                return socket.disconnect();
            }
            socket.on('error', (err) => {
                Logger.error(err);
            });
            return;
        });

        return io;
    }
}
