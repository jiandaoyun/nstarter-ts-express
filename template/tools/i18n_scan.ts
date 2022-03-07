import _ from 'lodash';
import async from 'async';
import fs, { Stats } from 'fs';
import path from 'path';

import { i18nextToPot } from 'i18next-conv';
import { Parser } from 'i18next-scanner';

const i18nParser = new Parser({
    keySeparator: false
});

const config = {
    debug: true,
    src: './src/',
    encoding: 'utf-8',
    concurrency: 10,
    functions: [
        'i18n.t'
    ],
    filePatterns: [
        '*.ts'
    ],
    output: './resources/i18n/server.pot'
};

const _extPattern = _.map(config.filePatterns, path.extname);

/**
 * @class I18nScanner
 */
class I18nScanner {
    /**
     * @param {String} content
     * @param {Function} callback
     * @static
     */
    public static scanContent(content: string, callback: Callback) {
        i18nParser.parseFuncFromString(content, {
            list: config.functions
        });
        return callback();
    }

    /**
     * @param {String|Path} filePath
     * @param {Function} callback
     * @static
     */
    public static scanFile(filePath: string, callback: Callback) {
        async.auto<{
            stat: Stats,
            scan: void
        }>({
            stat: (callback) => fs.stat(filePath, callback),
            scan: ['stat', (results, callback) => {
                const fileStats = results.stat;
                if (fileStats.isDirectory()) {
                    // Directory
                    return I18nScanner.scanDir(filePath, callback);
                } else if (fileStats.isFile()) {
                    // file
                    if (!_.includes(_extPattern, path.extname(filePath))) {
                        return callback();
                    }
                    if (config.debug) {
                        console.log(`[scan] ${ filePath }`);
                    }
                    async.auto<any>({
                        content: (callback) =>
                            fs.readFile(filePath, config.encoding, callback),
                        parse: ['content', (results, callback) =>
                            I18nScanner.scanContent(results.content, callback)]
                    }, callback);
                } else {
                    return callback();
                }
            }]
        }, callback);
    }

    /**
     * @param {String|Path} basePath
     * @param {Function} callback
     * @static
     */
    public static scanDir(basePath: string, callback: Callback) {
        async.auto<{
            files: string[],
            parse: void
        }>({
            files: (callback) => {
                fs.readdir(basePath, callback);
            },
            parse: ['files', (results, callback) => {
                async.eachLimit(results.files, config.concurrency, (file, callback) => {
                    I18nScanner.scanFile(path.resolve(basePath, file), callback);
                }, callback);
            }]
        }, callback);
    }

    /**
     * @returns {Object} - I18n key map
     */
    public static getI18nKeys() {
        return _.get(i18nParser.get(), 'en.translation', {});
    }
}

if (require.main === module) {
    module.exports = I18nScanner;
} else {
    async.auto({
        scan: (callback) =>
            I18nScanner.scanDir(config.src, callback),
        template: ['scan', (results, callback) => {
            const items = I18nScanner.getI18nKeys();
            const sorted: Record<string, string> = {};
            _.forEach(_.keys(items).sort(), (key) => {
                sorted[key] = items[key];
            });
            i18nextToPot('en', JSON.stringify(sorted))
                .then((result: string) => {
                    fs.writeFile(config.output, result, callback);
                });
        }]
    }, (err) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }
        return process.exit(0);
    });
}
