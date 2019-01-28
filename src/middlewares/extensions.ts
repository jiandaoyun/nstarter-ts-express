import { Request } from 'express';
import i18next from 'i18next';

export interface RequestExt extends Request {
    _locale: string,
    i18n: {
        t: i18next.TFunction
    },
    getLocale(): string;
    setLocale(locale: string): void;
}
