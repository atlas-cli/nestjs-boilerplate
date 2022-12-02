import { I18nAbstractLoader, I18nAbstractLoaderOptions } from './i18n.abstract.loader';
export declare class I18nYamlLoader extends I18nAbstractLoader {
    formatData(data: any): any;
    getDefaultOptions(): Partial<I18nAbstractLoaderOptions>;
}
