import { Request, Response, NextFunction } from 'express';
//#module i18n
import i18next from 'i18next';
//#endmodule i18n

export interface RequestExt extends Request {
    //#module i18n
    _locale: string,
    i18n: {
        t: i18next.TFunction
    },
    getLocale(): string;
    setLocale(locale: string): void;
    //#endmodule i18n
}

export interface RequestHandler {
    (req: RequestExt, res: Response, next: NextFunction): any;
}
