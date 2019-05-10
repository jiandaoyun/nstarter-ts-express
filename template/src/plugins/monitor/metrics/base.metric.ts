import { Metric } from 'prom-client';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseMetric<T extends Metric> {
    protected _metric: T;

    public get metric() {
        return this._metric;
    }
}

