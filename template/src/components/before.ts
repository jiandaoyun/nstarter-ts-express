import _ from 'lodash';
import { Logger, RequestLogger } from 'nstarter-core';
import { defaultTransports, requestTransports } from './lib/logger';

export const beforeLoad = () => {
    // 初始化日志记录
    _.forEach(defaultTransports, (transport) => {
        Logger.registerTransport(transport);
    });
    _.forEach(requestTransports, (transport) => {
        RequestLogger.registerTransport(transport);
    });
};
