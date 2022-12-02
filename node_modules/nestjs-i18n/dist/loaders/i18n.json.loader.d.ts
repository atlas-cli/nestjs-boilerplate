import { I18nAbstractLoader, I18nAbstractLoaderOptions } from './i18n.abstract.loader';
export declare class I18nJsonLoader extends I18nAbstractLoader {
    getDefaultOptions(): Partial<I18nAbstractLoaderOptions>;
    formatData(data: any): any;
}
