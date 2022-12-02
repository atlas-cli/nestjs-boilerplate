import { Configuration } from '../configuration';
import { AssetsManager } from './assets-manager';
import { PluginsLoader } from './plugins-loader';
import webpack = require('webpack');
export declare class WebpackCompiler {
    private readonly pluginsLoader;
    constructor(pluginsLoader: PluginsLoader);
    run(configuration: Required<Configuration>, webpackConfigFactoryOrConfig: (config: webpack.Configuration, webpackRef: typeof webpack) => webpack.Configuration, tsConfigPath: string, appName: string, isDebugEnabled: boolean | undefined, watchMode: boolean | undefined, assetsManager: AssetsManager, onSuccess?: () => void): void;
}
