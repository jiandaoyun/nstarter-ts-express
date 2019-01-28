'use strict';
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const path = require('path');

const { Parser } = require('i18next-scanner');
const { i18nextToPot } = require('i18next-conv');

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
    static scanContent (content, callback) {
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
    static scanFile (filePath, callback) {
        async.auto({
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
                    async.auto({
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
    static scanDir (basePath, callback) {
        async.auto({
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
    static getI18nKeys () {
        return _.get(i18nParser.get(), 'en.translation', {});
    }
}

if (module.parent) {
    module.exports = I18nScanner;
} else {
    async.auto({
        scan: (callback) =>
            I18nScanner.scanDir(config.src, callback),
        template: ['scan', (results, callback) => {
            const items = I18nScanner.getI18nKeys();
            const sorted = {};
            _.forEach(_.keys(items).sort(), (key) =>
                sorted[key] = items[key]
            );
            i18nextToPot('en', JSON.stringify(sorted))
                .then((result) => {
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
