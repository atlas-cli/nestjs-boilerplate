export interface ApplicationProps {
  applicationName: string;
  stageName: string;
  createNameCustom?: (name: string, config: ApplicationProps) => string;
}
