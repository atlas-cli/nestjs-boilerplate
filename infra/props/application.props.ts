export interface ApplicationProps {
  applicationName: string;
  stageName: string;
  createNameCustom?: (stageName: string, applicationName: string) => (name: string,) => string;
}
