import { ApplicationProps } from './../props/application.props';

export const createName = (name: string, config: ApplicationProps) => {
  if (!config.createNameCustom)
    return `${config.applicationName}-${config.stageName}-${name}`;

  return config.createNameCustom(name, config);
};
