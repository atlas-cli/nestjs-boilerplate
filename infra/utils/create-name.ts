import { ApplicationProps } from './../props/application.props';

export const createName = (name: string, config: ApplicationProps) => {
  if (config.createNameCustom == undefined)
    return config.createNameCustom(name, config);
  return `${config.applicationName}-${config.stageName}-${name}`;
};
