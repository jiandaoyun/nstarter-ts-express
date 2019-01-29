import { BaseService } from './service.base';
import { i18n } from '../i18n';
import { Services } from './enum';

class I18nService extends BaseService {
    public name = Services.i18n;
    public enabled = true;

    public start(callback: Function) {
        i18n.init((err) => {
            if (err) {
                return callback(err);
            }
            return super.start(callback);
        });
    }
}

export const i18nService = new I18nService();
