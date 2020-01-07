import _ from 'lodash';

import { ErrorBuilder, NsError, registerErrorMessages } from 'nstarter-core';
import { ErrorTypes, errorMessages } from './err_msgs';

registerErrorMessages(errorMessages);

const errors = {} as any as Record<keyof typeof ErrorTypes, ErrorBuilder>;

// 注册错误生成工厂方法
_.forEach(Object.keys(ErrorTypes), (errorType: keyof typeof ErrorTypes) => {
    errors[errorType] = (...args) => new NsError(ErrorTypes[errorType], ...args) as Error;
});

export {
    errors as Errors
};
