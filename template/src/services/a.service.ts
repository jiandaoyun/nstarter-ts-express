import { injectable } from 'inversify';
import { lazyInject } from './container';
import { items } from './items';
import { ServiceB } from './b.service';

@injectable()
export class ServiceA {
    @lazyInject(items.ServiceB)
    protected _x: ServiceB;

    public run() {
        return 'A';
    }

    public runX() {
        return this._x.run();
    }
}
