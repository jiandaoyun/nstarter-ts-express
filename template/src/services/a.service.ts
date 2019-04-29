import { lazyInject, provideService } from './container';
import { ServiceB } from './b.service';

@provideService()
export class ServiceA {
    @lazyInject(ServiceB)
    protected _x: ServiceB;

    public run() {
        return 'A';
    }

    public runX() {
        return this._x.run();
    }
}
