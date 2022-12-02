/// <reference types="node" />
import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from "tapable";
export interface ResolvePluginInstance {
    apply: (resolver: Resolver) => void;
}
declare interface AliasOption {
    alias: string | false | string[];
    name: string;
    onlyModule?: boolean;
}
declare interface BaseResolveRequest {
    path: string | false;
    descriptionFilePath?: string;
    descriptionFileRoot?: string;
    descriptionFileData?: object;
    relativePath?: string;
    ignoreSymlinks?: boolean;
    fullySpecified?: boolean;
}
export declare interface FileSystem {
    readFile: {
        (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<string | Buffer>): void;
    };
    readdir: {
        (arg0: string, arg1: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>): void;
    };
    readJson?: {
        (arg0: string, arg1: FileSystemCallback<object>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<object>): void;
    };
    readlink: {
        (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<string | Buffer>): void;
    };
    lstat?: {
        (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<string | Buffer>): void;
    };
    stat: {
        (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
        (arg0: string, arg1: object, arg2: FileSystemCallback<string | Buffer>): void;
    };
}
declare interface FileSystemCallback<T> {
    (err?: null | (PossibleFileSystemError & Error), result?: T): any;
}
declare interface FileSystemDirent {
    name: string | Buffer;
    isDirectory: () => boolean;
    isFile: () => boolean;
}
declare interface FileSystemStats {
    isDirectory: () => boolean;
    isFile: () => boolean;
}
declare interface ParsedIdentifier {
    request: string;
    query: string;
    fragment: string;
    directory: boolean;
    module: boolean;
    file: boolean;
    internal: boolean;
}
declare type Plugin = {
    apply: (arg0: Resolver) => void;
} | ((this: Resolver, arg1: Resolver) => void);
declare interface PnpApiImpl {
    resolveToUnqualified: (arg0: string, arg1: string, arg2: object) => string;
}
declare interface PossibleFileSystemError {
    code?: string;
    errno?: number;
    path?: string;
    syscall?: string;
}
/**
 * Resolve context
 */
export declare interface ResolveContext {
    contextDependencies?: WriteOnlySet<string>;
    /**
     * files that was found on file system
     */
    fileDependencies?: WriteOnlySet<string>;
    /**
     * dependencies that was not found on file system
     */
    missingDependencies?: WriteOnlySet<string>;
    /**
     * set of hooks' calls. For instance, `resolve → parsedResolve → describedResolve`,
     */
    stack?: Set<string>;
    /**
     * log function
     */
    log?: (arg0: string) => void;
}
declare interface ResolveOptions {
    alias: AliasOption[];
    fallback: AliasOption[];
    aliasFields: Set<string | string[]>;
    cachePredicate: (arg0: ResolveRequest) => boolean;
    cacheWithContext: boolean;
    /**
     * A list of exports field condition names.
     */
    conditionNames: Set<string>;
    descriptionFiles: string[];
    enforceExtension: boolean;
    exportsFields: Set<string | string[]>;
    importsFields: Set<string | string[]>;
    extensions: Set<string>;
    fileSystem: FileSystem;
    unsafeCache: false | object;
    symlinks: boolean;
    resolver?: Resolver;
    modules: (string | string[])[];
    mainFields: {
        name: string[];
        forceRelative: boolean;
    }[];
    mainFiles: Set<string>;
    plugins: Plugin[];
    pnpApi: null | PnpApiImpl;
    roots: Set<string>;
    fullySpecified: boolean;
    resolveToContext: boolean;
    restrictions: Set<string | RegExp>;
    preferRelative: boolean;
    preferAbsolute: boolean;
}
export declare type ResolveRequest = BaseResolveRequest & Partial<ParsedIdentifier>;
export declare abstract class Resolver {
    fileSystem: FileSystem;
    options: ResolveOptions;
    hooks: {
        resolveStep: SyncHook<[
            AsyncSeriesBailHook<[
                ResolveRequest,
                ResolveContext
            ], null | ResolveRequest>,
            ResolveRequest
        ]>;
        noResolve: SyncHook<[ResolveRequest, Error]>;
        resolve: AsyncSeriesBailHook<[
            ResolveRequest,
            ResolveContext
        ], null | ResolveRequest>;
        result: AsyncSeriesHook<[ResolveRequest, ResolveContext]>;
    };
    ensureHook(name: string | AsyncSeriesBailHook<[
        ResolveRequest,
        ResolveContext
    ], null | ResolveRequest>): AsyncSeriesBailHook<[
        ResolveRequest,
        ResolveContext
    ], null | ResolveRequest>;
    getHook(name: string | AsyncSeriesBailHook<[
        ResolveRequest,
        ResolveContext
    ], null | ResolveRequest>): AsyncSeriesBailHook<[
        ResolveRequest,
        ResolveContext
    ], null | ResolveRequest>;
    resolveSync(context: object, path: string, request: string): string | false;
    resolve(context: object, path: string, request: string, resolveContext: ResolveContext, callback: (arg0: null | Error, arg1?: string | false, arg2?: ResolveRequest) => void): void;
    doResolve(hook?: any, request?: any, message?: any, resolveContext?: any, callback?: any): any;
    parse(identifier: string): ParsedIdentifier;
    isModule(path?: any): boolean;
    isPrivate(path?: any): boolean;
    isDirectory(path: string): boolean;
    join(path?: any, request?: any): string;
    normalize(path?: any): string;
}
declare interface WriteOnlySet<T> {
    add: (T?: any) => void;
}
export {};
