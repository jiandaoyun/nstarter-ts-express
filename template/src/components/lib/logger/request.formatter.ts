import { IRequestMetaFormatter } from 'nstarter-core';

/**
 * 请求日志元数据处理方法
 * @param req
 * @param res
 * @param meta
 */
export const reqMetaFormatter: IRequestMetaFormatter = (req, res, meta) => {
    return {
        ...meta,
        request_id: req.requestId
    };
};
