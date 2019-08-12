// @see https://github.com/epoberezkin/ajv-keywords/issues/53

declare module 'ajv-keywords' {
    import { Ajv } from 'ajv';
    type AdditionalKeywords =
        | 'typeof'
        | 'instanceof'
        | 'range'
        | 'exclusiveRange'
        | 'switch'
        | 'select'
        | 'selectCases'
        | 'selectDefault'
        | 'patternRequired'
        | 'prohibited'
        | 'deepProperties'
        | 'deepRequired'
        | 'uniqueItemProperties'
        | 'regexp'
        | 'formatMaximum'
        | 'formatMinimum'
        | 'formatExclusiveMaximum'
        | 'formatExclusiveMinimum'
        | 'dynamicDefaults';

    function keywords(ajv: Ajv, include?: AdditionalKeywords | AdditionalKeywords[]): void;
    export function get(key: string): any;
    export = keywords;
}
