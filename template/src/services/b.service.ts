import { lazyInject, provideService } from './container';
import { ServiceA } from './a.service';

@provideService()
export class ServiceB {
    @lazyInject(ServiceA)
    protected _x: ServiceA;

    public run() {
        return 'B';
    }

    public runX() {
        return this._x.run();
    }
}
