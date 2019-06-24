declare module 'i18next-scanner' {
    export class Parser {
        constructor(options);

        public parseFuncFromString(string, options);

        public get(): any;
    }
}
