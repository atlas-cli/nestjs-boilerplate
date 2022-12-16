import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuroraDatabaseProxyProps } from './props/aurora-database-proxy.props';

export class AuroraDatabaseProxy extends Construct {
  proxy: rds.DatabaseProxy;
  constructor(scope: Construct, id: string, props?: AuroraDatabaseProxyProps) {
    super(scope, id);
    const name = 'aurora-database-proxy';
    const { auroraDatabaseCluster, auroraDatabaseVpc } = props;
    const { vpc, dbSecurityGroup } = auroraDatabaseVpc;
    
    // create database proxy
    this.proxy = new rds.DatabaseProxy(this, 'Proxy', {
      dbProxyName: name,
      proxyTarget: rds.ProxyTarget.fromCluster(auroraDatabaseCluster),
      secrets: [auroraDatabaseCluster.secret!],
      vpc,
      securityGroups: [dbSecurityGroup],
      iamAuth: true,
    });

    // exports
    new CfnOutput(this, 'AuroraDatabaseProxyArn', {
      value: this.proxy.dbProxyArn,
      exportName: name + '-arn',
    });
    new CfnOutput(this, 'AuroraDatabaseProxyName', {
      value: this.proxy.dbProxyName,
      exportName: name + '-name',
    });
    new CfnOutput(this, 'AuroraDatabaseProxyEndpoint', {
      value: this.proxy.endpoint,
      exportName: name + '-endpoint',
    });
    new CfnOutput(this, 'AuroraDatabaseProxyHost', {
      value: this.proxy.endpoint,
      exportName: name + '-host',
    });
  }

  // export resources
  exports(name: string) {}

  // import resrouces
  static fromNameAndSecurityGroup(scope, auroraName: string, securityGroup) {
    const proxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(
      scope,
      'AuroraDatabaseProxy',
      {
        dbProxyArn: cdk.Fn.importValue(auroraName + '-proxy-arn'),
        dbProxyName: cdk.Fn.importValue(auroraName + '-proxy-name'),
        endpoint: cdk.Fn.importValue(auroraName + '-proxy-endpoint'),
        securityGroups: [securityGroup],
      },
    );
    return { proxy };
  }
}
