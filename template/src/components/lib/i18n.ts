import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { gettextToI18next } from 'i18next-conv';
import { Request, RequestHandler } from 'express';

import { config } from '../../config';
import { Consts } from '../../constants';
import i18next, { i18n, ResourceLanguage, TFunction, TOptions } from 'i18next';

const _translationPath = './resources/i18n/';

interface I18nOptions {
    namespace: string;
    defaultLocale: string;
}

export class I18n {
    private readonly _options: I18nOptions;
    private _locales: string[] = [];
    private _i18next: i18n;
    private _translations: {
        [locale: string]: ResourceLanguage
    } = {};
    private _translators: {
        [locale: string]: TFunction
    } = {};

    constructor(options?: I18nOptions) {
        this._options = _.defaults(options, {
            namespace: 'translation',
            defaultLocale: config.system.locale
        });
    }

    public async init() {
        const o = this._options;
        await this._loadTranslations();
        const resources: {
            [locale: string]: ResourceLanguage
        } = {};
        _.forEach(this._translations, (translation, locale: string) => {
            this._locales.push(locale);
            _.set(resources, [locale, o.namespace], translation);
        });
        this._i18next = i18next.createInstance();
        await this._i18next.init({
            resources,
            ns: o.namespace,
            supportedLngs: this._locales,
            fallbackLng: o.defaultLocale,
            compatibilityJSON: 'v3',
            lowerCaseLng: true,
            keySeparator: false,
            interpolation: {
                escapeValue: false,
                skipOnVariables: false
            }
        }, undefined);
    }

    private async _loadTranslations() {
        const files = fs.readdirSync(_translationPath);
        const translationFiles = _.filter(files, (file) =>
            path.extname(file) === '.po'
        );
        for (const file of translationFiles) {
            const filePath = path.resolve(_translationPath, file);
            const locale = path.basename(file, path.extname(file));
            const content = fs.readFileSync(filePath, 'utf-8');
            this._translations[locale] = JSON.parse(await gettextToI18next(locale, content));
        }
    }

    public isLocaleSupported(locale: string): boolean {
        return _.includes(this._locales, locale);
    }

    private _getTranslator(locale: string): TFunction {
        const o = this._options;
        let targetLocale = locale;
        if (!this.isLocaleSupported(targetLocale)) {
            targetLocale = o.defaultLocale;
        }
        let translator = this._translators[targetLocale];
        if (translator) {
            return translator;
        }
        if (!this._i18next) {
            return (key: any) => key;
        }
        translator = this._i18next.getFixedT(targetLocale, o.namespace);
        this._translators[targetLocale] = translator;
        return translator;
    }

    /**
     * Translator method
     */
    public t(key: string, locale?: string, options?: TOptions): string {
        const targetLocale = locale || config.system.locale;
        const translator = this._getTranslator(targetLocale);
        if (options) {
            return translator(key, options);
        } else {
            return translator(key);
        }
    }

    public get middleware(): RequestHandler {
        return (req: Request, res, next) => {
            req._locale = _.get(req.cookies, Consts.System.LOCALE_COOKIE_KEY);
            req.i18n = {
                t: this._getTranslator(req._locale)
            };
            req.getLocale = () => req._locale || config.system.locale;
            req.setLocale = (locale: string) => {
                if (!locale || !this.isLocaleSupported(locale)) {
                    return;
                }
                req._locale = locale;
                req.i18n.t = this._getTranslator(req._locale);
            };
            return next();
        };
    }
}
