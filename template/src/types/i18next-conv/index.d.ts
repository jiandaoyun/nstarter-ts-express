declare module 'i18next-conv' {
    export function gettextToI18next(locale: string, content: string): Promise;

    export function i18nextToPot(locale: string, content: string): Promise;
}
