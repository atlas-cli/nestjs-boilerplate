import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuroraDatabaseProxyProps } from './props/aurora-database-proxy.props';

export class AuroraDatabaseProxy extends Construct {
  proxy: rds.DatabaseProxy;
  constructor(scope: Construct, id: string, props?: AuroraDatabaseProxyProps) {
    super(scope, id);
    const {
      applicationName,
      stageName,
      createNameCustom,
      auroraDatabaseVpc,
      auroraDatabaseCluster,
    } = props;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) =>
            `${stageName}-${applicationName}-aurora-database-${name}`;
    const { vpc, dbSecurityGroup } = auroraDatabaseVpc;

    // create database proxy
    this.proxy = new rds.DatabaseProxy(this, createName('proxy'), {
      dbProxyName: createName('proxy'),
      proxyTarget: rds.ProxyTarget.fromCluster(auroraDatabaseCluster),
      secrets: [auroraDatabaseCluster.secret!],
      vpc,
      securityGroups: [dbSecurityGroup],
      iamAuth: true,
    });
    this.exports(createName('proxy'));
  }

  // export resources
  exports(scopedName: string) {
    const createName = (name: string) => `${scopedName}-${name}`;
    // exports
    new CfnOutput(this, createName('arn'), {
      value: this.proxy.dbProxyArn,
      exportName: createName('arn'),
    });
    new CfnOutput(this, createName('name'), {
      value: this.proxy.dbProxyName,
      exportName: createName('name'),
    });
    new CfnOutput(this, createName('endpoint'), {
      value: this.proxy.endpoint,
      exportName: createName('endpoint'),
    });
    new CfnOutput(this, createName('host'), {
      value: this.proxy.endpoint,
      exportName: createName('host'),
    });
  }

  // import resrouces

  static fromNameAndSecurityGroup(scope, scopedName: string, securityGroup) {
    const createName = (name: string) => `${scopedName}-${name}`;
    const proxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(
      scope,
      'AuroraDatabaseProxy',
      {
        dbProxyArn: cdk.Fn.importValue(createName('arn')),
        dbProxyName: cdk.Fn.importValue(createName('name')),
        endpoint: cdk.Fn.importValue(createName('endpoint')),
        securityGroups: [securityGroup],
      },
    );
    return { proxy };
  }
}
