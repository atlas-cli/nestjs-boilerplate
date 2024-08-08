import { Construct } from 'constructs';
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { vpcCDIR } from './../constants';

export const createVpc = (scope: Construct, scopedName: string): Vpc => {
  return new Vpc(scope, scopedName + 'Vpc', {
    vpcName: scopedName + 'Vpc',
    ipAddresses: IpAddresses.cidr(vpcCDIR),
    maxAzs: 2,
    natGateways: 1,
    restrictDefaultSecurityGroup: false,
    subnetConfiguration: [
      {
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24,
        name: 'subnet-public',
      },
      {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
        name: 'subnet-private',
      },
    ],
  });
};
