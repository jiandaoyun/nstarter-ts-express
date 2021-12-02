import { RequestHandler, Router } from 'express';
import URL from 'url';
import httpStatus from 'http-status';

import { BaseComponent, component, injectComponent } from 'nstarter-core';
import { metricsView } from 'nstarter-metrics';
import { metricsMonitor, MetricsMonitor } from './lib/monitor';
//#module redis
import { RedisComponent } from './redis.component';
//#endmodule redis
//#module mongodb
import { MongodbComponent } from './mongodb.component';
//#endmodule mongodb

@component()
export class MonitorComponent extends BaseComponent {
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
     * Prometheus 监控指标采集视图
     */
    public get metricsRouter(): Router {
        const router = Router();
        router.get('/metrics', metricsView);
        return router;
    }

    /**
     * 检测后台服务是否可用
     */
    public isReady(): boolean {
        if (this._isShutDown) {
            return false;
        }
        let isReady = true;
        //#module mongodb
        isReady = isReady && this._mongodbComponent.isReady();
        //#endmodule mongodb
        //#module redis
        isReady = isReady && this._redisComponent.isReady();
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
        router.get('/liveness_check', (req, res) => {
            return res.status(httpStatus.OK).send('ok').end();
        });
        router.get('/health_check', (req, res) => {
            res.set('Content-Type', 'text/plain');
            if (this.isReady()) {
                res.status(httpStatus.OK).send('ok');
            } else {
                res.status(httpStatus.BAD_REQUEST).send('failed');
            }
            return res.end();
        });
        return router;
    }

    /**
     * 用于跟踪记录 http 请求的监控中间件
     */
    public get requestMonitorMiddleware(): RequestHandler {
        return (req, res, next) => {
            const path = URL.parse(req.originalUrl).pathname;
            const startTime = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const meta = {
                    method: req.method,
                    status: res.statusCode,
                    path: ''
                };
                // 综合统计请求指标
                this._monitor.recordRequest(meta, duration);
                // 按路径统计请求指标
                if (path) {
                    this._monitor.recordRequest({ ...meta, path }, duration);
                }
            });
            return next();
        };
    }
}
