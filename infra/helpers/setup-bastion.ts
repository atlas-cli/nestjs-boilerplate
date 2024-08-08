import { CfnOutput, Fn } from 'aws-cdk-lib';
import {
  BastionHostLinux,
  ISecurityGroup,
  IVpc,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';

export function setupBastion(
  scope: any,
  scopedName: string,
  vpc: IVpc,
  securityGroup: ISecurityGroup,
): void {
  // Create bastion host instance in public subnet
  const bastionHostLinux = new BastionHostLinux(
    scope,
    `${scopedName}BastionHostLinux`,
    {
      vpc: vpc,
      securityGroup: securityGroup,
      subnetSelection: {
        subnetType: SubnetType.PUBLIC,
      },
    },
  );

  // Retrieve the host of the database from the output of another stack
  const applicationDatabaseHost = Fn.importValue(
    `${scopedName}DatabaseClusterHost`,
  );

  // Display command for starting the tunnel session
  const startTunnel = `aws ssm start-session \\
            --target ${bastionHostLinux.instanceId} \\
            --document-name AWS-StartPortForwardingSessionToRemoteHost \\
            --parameters '{"host":["${applicationDatabaseHost}"],"portNumber":["5432"], "localPortNumber":["5432"]}'`;

  // Output the command for starting the tunnel session
  new CfnOutput(scope, `${scopedName}StartTunnel`, { value: startTunnel });
}
