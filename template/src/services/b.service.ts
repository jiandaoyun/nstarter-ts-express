import { injectable } from 'inversify';
import { lazyInject } from './container';
import { items } from './items';
import { ServiceA } from './a.service';

@injectable()
export class ServiceB {
    @lazyInject(items.ServiceA)
    protected _x: ServiceA;

    public run() {
        return 'B';
    }

    public runX() {
        return this._x.run();
    }
}
