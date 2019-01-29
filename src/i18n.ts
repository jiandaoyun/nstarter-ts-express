import _ from 'lodash';
import async from 'async';
import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { gettextToI18next } from 'i18next-conv';
import { RequestHandler } from 'express';

import { config } from './config';
import Consts from './constants';
import { RequestExt } from './middlewares/extensions';

const _translationPath = './resources/i18n/';

interface I18nOptions {
    namespace: string,
    defaultLocale: string
}

class I18n {
    private _options: I18nOptions;
    private _locales: string[] = [];
    private _i18next: i18next.i18n;
    private _translations: {
        [locale: string]: i18next.ResourceLanguage
    } = {};
    private _translators: {
        [locale: string]: i18next.TFunction;
    } = {};
    private static _instance: I18n;

    constructor (options?: I18nOptions) {
        this._options = _.defaults(options, {
            namespace: 'translation',
            defaultLocale: config.system.locale
        });
    }

    public init (callback: async.AsyncResultCallback<any>) {
        const o = this._options;
        async.auto<any>({
            translations: (callback) =>
                this._loadTranslations(callback),
            i18next: ['translations', (results, callback: async.ErrorCallback) => {
                const resources: {
                    [locale: string]: i18next.ResourceLanguage
                } = {};
                _.forEach(this._translations, (translation, locale: string) => {
                    this._locales.push(locale);
                    _.set(resources, [locale, o.namespace], translation);
                });
                this._i18next = i18next.createInstance();
                this._i18next.init({
                    resources,
                    ns: o.namespace,
                    whitelist: this._locales,
                    fallbackLng: o.defaultLocale,
                    lowerCaseLng: true,
                    keySeparator: false,
                    interpolation: {
                        escapeValue: false
                    }
                }, callback);
            }]
        }, callback);
    }

    private _loadTranslations (callback: async.ErrorCallback) {
        const files = fs.readdirSync(_translationPath);
        const translationFiles = _.filter(files, (file) =>
            path.extname(file) === '.po'
        );
        async.each(translationFiles, (file, callback) => {
            const filePath = path.resolve(_translationPath, file);
            const locale = path.basename(file, path.extname(file));
            fs.readFile(filePath, 'utf-8', (err, content) => {
                if (err) {
                    return callback(err);
                }
                gettextToI18next(locale, content)
                    .then((translation: string) => {
                        this._translations[locale] = JSON.parse(translation);
                    })
                    .then(callback);
            });
        }, callback);
    }

    public isLocaleSupported (locale: string): boolean {
        return _.includes(this._locales, locale);
    }

    private _getTranslator (locale: string): i18next.TFunction {
        const o = this._options;
        if (!this.isLocaleSupported(locale)) {
            locale = o.defaultLocale;
        }
        let translator = this._translators[locale];
        if (translator) {
            return translator;
        }
        if (!this._i18next) {
            return (key: any) => key;
        }
        translator = this._i18next.getFixedT(locale, o.namespace);
        this._translators[locale] = translator;
        return translator;
    }

    /**
     * Translator method
     */
    public t (key: string, locale: string, options: i18next.TOptions): string {
        locale = locale || config.system.locale;
        const translator = this._getTranslator(locale);
        return translator(key, options);
    }

    public get middleware (): RequestHandler {
        return (req: RequestExt, res, next) => {
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
                _.set(res.locals.STATIC, 'locale', locale);
            };
            // Init static locale param for template engine
            _.set(res.locals.STATIC, 'locale', req.getLocale());
            return next();
        };
    }

    public static getInstance(): I18n {
        if (!I18n._instance) {
            I18n._instance = new I18n();
        }
        return I18n._instance;
    }
}

const i18n = I18n.getInstance();

export = i18n;
