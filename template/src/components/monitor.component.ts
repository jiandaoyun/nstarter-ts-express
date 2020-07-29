import { RequestHandler, Router } from 'express';
import URL from 'url';
import httpStatus from 'http-status';

import { provideComponent, injectComponent } from 'nstarter-core';
import { metricsView } from 'nstarter-metrics';
import { metricsMonitor, MetricsMonitor } from './lib/monitor';
import { AbstractComponent } from './abstract.component';
import { config } from '../config';
import { RedisComponent } from './redis.component';
import { MongodbComponent } from './mongodb.component';

@provideComponent()
export class MonitorComponent extends AbstractComponent {
    private readonly _monitor: MetricsMonitor;
    private _isShutDown = false;

    //#module redis
    @injectComponent()
    private _redisComponent: RedisComponent;
    //#endmodule redis

    //#module mongodb
    @injectComponent()
    private _mongodbComponent: MongodbComponent;
    //#endmodule mongodb

    constructor() {
        super();
        this._monitor = metricsMonitor;
    }

    public get monitor() {
        return this._monitor;
    }

    /**
     * Get express view for prometheus metrics
     */
    public get metricsRouter(): Router {
        const router = Router();
        router.get(config.system.monitor.metric_path, metricsView);
        return router;
    }

    /**
     * Check if backend service ready.
     */
    private get isReady(): boolean {
        if (this._isShutDown) {
            return false;
        }
        let isReady = true;
        //#module mongodb
        isReady = isReady && (this._mongodbComponent.db.readyState === 1);
        //#endmodule mongodb
        //#module redis
        isReady = isReady && (this._redisComponent.redis.status === 'ready');
        //#endmodule redis
        return isReady;
    }

    /**
     * 标记服务进入关闭状态
     *
     * 用于告知 readinessProbe 用于 graceful shutdown
     *
     * @param status
     */
    public setShutdownState(status = true) {
        this._isShutDown = status;
    }

    /**
     * Request for health check
     */
    public get healthRouter(): Router {
        const router = Router();
        router.get(config.system.monitor.health_path, (req, res) => {
            res.set('Content-Type', 'text/plain');
            if (this.isReady) {
                res.status(httpStatus.OK).send('ok');
            } else {
                res.status(httpStatus.BAD_REQUEST).send('failed');
            }
            return res.end();
        });
        return router;
    }

    /**
     * Get express middleware to record request metrics
     */
    public get requestMonitorMiddleware(): RequestHandler {
        return (req, res, next) => {
            const path = URL.parse(req.originalUrl).pathname;
            if (path === config.system.monitor.metric_path) {
                return next();
            }
            const startTime = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const meta = {
                    method: req.method,
                    status: res.statusCode,
                    path: ''
                };
                // record total request metrics
                this._monitor.recordRequest(meta, duration);
                // record request metrics by path
                if (path) {
                    this._monitor.recordRequest({ ...meta, path }, duration);
                }
            });
            return next();
        };
    }
}
