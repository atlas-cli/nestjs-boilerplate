import { CfnOutput } from 'aws-cdk-lib';

export const createOutput = (self, name: string, value: any) => {
  const output = new CfnOutput(self, name, {
    value: value,
    exportName: name,
  });
  return output;
};
