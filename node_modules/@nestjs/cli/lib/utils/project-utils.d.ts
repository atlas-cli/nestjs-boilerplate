import { Answers } from 'inquirer';
import { Configuration, ProjectConfiguration } from '../configuration';
export declare function shouldAskForProject(schematic: string, configurationProjects: {
    [key: string]: ProjectConfiguration;
}, appName: string): boolean;
export declare function shouldGenerateSpec(configuration: Required<Configuration>, schematic: string, appName: string, specValue: boolean, specPassedAsInput?: boolean): any;
export declare function askForProjectName(promptQuestion: string, projects: string[]): Promise<Answers>;
export declare function moveDefaultProjectToStart(configuration: Configuration, defaultProjectName: string, defaultLabel: string): string[];
