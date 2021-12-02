import helmet from 'helmet';
import nocache from 'nocache';

/**
 * 安全处理中间件
 *
 * 参考 OWASP 安全性建议
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
 */
export const securityMiddlewares = [
    // Strict-Transport-Security
    helmet.hsts(),
    // X-Content-Type-Options
    helmet.noSniff(),
    // Cache-Control & Pragma
    nocache(),
    // X-Download-Options
    helmet.ieNoOpen(),
    // X-Powered-By
    helmet.hidePoweredBy()
];
