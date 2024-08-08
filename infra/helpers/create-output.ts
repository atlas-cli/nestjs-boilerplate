import { CfnOutput } from 'aws-cdk-lib';

export const createOutput = (self: any, name: string, value: any): CfnOutput => {
  const output = new CfnOutput(self, name, {
    value: value, // The value of the output
    exportName: name, // The name used for exporting the output value
  });
  return output;
};
