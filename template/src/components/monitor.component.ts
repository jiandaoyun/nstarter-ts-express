import _ from 'lodash';
//#module cron
import { CronJob } from 'cron';
import { Pushgateway } from 'prom-client';
//#endmodule cron
import { RequestHandler, Router } from 'express';
import URL from 'url';

import { AbstractComponent } from './abstract.component';
import { LoggerComponent } from './logger.component';
import { lazyInject, provideComponent } from './container';
import { config } from '../config';
import { Monitor, registry } from '../plugins/monitor';

@provideComponent()
export class MonitorComponent extends AbstractComponent {
    private readonly _monitor: typeof Monitor;

    @lazyInject(LoggerComponent)
    private _logger: LoggerComponent;

    constructor() {
        super();
        //#module cron
        this.startPushTask();
        //#endmodule cron
        this._monitor = Monitor;
    }

    //#module cron
    public startPushTask() {
        const gatewayUrl = config.system.monitor.gateway;
        if (!gatewayUrl) {
            return;
        }
        const gateway = new Pushgateway(
            gatewayUrl, { timeout: 5000 }, registry
        );
        return new CronJob({
            // push metric data to prometheus push-gateway every 10s
            cronTime: '*/10 * * * * *',
            onTick: () => {
                gateway.pushAdd({
                    jobName: 'server',
                    groupings: {
                        instance: config.hostname,
                        // pm2 process id
                        pm_id: _.get(process, 'env.pm_id', 0)
                    }
                }, (err) => {
                    if (err) {
                        this._logger.logger.warn(err);
                    }
                });
            },
            start: true
        });
    }
    //#endmodule cron

    public get monitor() {
        return this._monitor;
    }

    /**
     * Get express view for prometheus metrics
     */
    public get metricsRouter(): Router {
        const router = Router();
        router.get(config.system.monitor.metric_path, (req, res) => {
            res.set('Content-Type', registry.contentType);
            return res.end(registry.metrics());
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
                Monitor.recordRequest(meta, duration);
                // record request metrics by path
                if (path) {
                    Monitor.recordRequest({ ...meta, path }, duration);
                }
            });
            return next();
        };
    }
}
