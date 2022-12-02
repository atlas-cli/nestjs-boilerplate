"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGitIgnore = exports.defaultOutDir = exports.defaultConfiguration = void 0;
exports.defaultConfiguration = {
    language: 'ts',
    sourceRoot: 'src',
    collection: '@nestjs/schematics',
    entryFile: 'main',
    projects: {},
    monorepo: false,
    compilerOptions: {
        tsConfigPath: 'tsconfig.build.json',
        webpack: false,
        webpackConfigPath: 'webpack.config.js',
        plugins: [],
        assets: [],
    },
    generateOptions: {},
};
exports.defaultOutDir = 'dist';
exports.defaultGitIgnore = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json`;
