import { CfnOutput } from "aws-cdk-lib";

export const createOutput = (name: string, value: any) => {
    const output = new CfnOutput(this, name, {
        value: value,
        exportName: name,
    });
    return output;
};