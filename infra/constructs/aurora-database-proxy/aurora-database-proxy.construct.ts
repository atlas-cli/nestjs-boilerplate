import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { ApplicationProps } from '../../props/application.props';
import { createName } from '../../utils/create-name';
import { createOutput } from '../../utils/create-output';
import { AuroraDatabaseProxyProps } from './props/aurora-database-proxy.props';

export class AuroraDatabaseProxy extends Construct {
  proxy: rds.DatabaseProxy;
  constructor(scope: Construct, id: string, props: AuroraDatabaseProxyProps) {
    super(scope, id);

    // get vpc, security group and auroraDatabaseCluster
    const { securityGroup, vpc, auroraDatabaseCluster } = props;

    // create a aurora db cluster serverless v2 postgres
    const DATABASE_PROXY_NAME = createName('proxy', props);
    this.proxy = new rds.DatabaseProxy(this, DATABASE_PROXY_NAME, {
      dbProxyName: DATABASE_PROXY_NAME,
      proxyTarget: rds.ProxyTarget.fromCluster(auroraDatabaseCluster),
      secrets: [auroraDatabaseCluster.secret],
      vpc,
      securityGroups: [securityGroup],
      iamAuth: true,
    });
    this.exports('aurora-database-proxy', props);
  }

  // export resources
  exports(scopedName: string, props: AuroraDatabaseProxyProps) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // outputs
    createOutput(this, createNameScoped('arn', props), this.proxy.dbProxyArn);
    createOutput(this, createNameScoped('name', props), this.proxy.dbProxyName);
    createOutput(
      this,
      createNameScoped('endpoint', props),
      this.proxy.endpoint,
    );
    createOutput(this, createNameScoped('host', props), this.proxy.endpoint);
  }

  // import resrouces

  static fromNameAndSecurityGroup(
    scope,
    scopedName: string,
    securityGroup,
    props: ApplicationProps,
  ) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // import proxy
    const proxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(
      scope,
      createNameScoped('proxy', props),
      {
        dbProxyArn: cdk.Fn.importValue(createNameScoped('arn', props)),
        dbProxyName: cdk.Fn.importValue(createNameScoped('name', props)),
        endpoint: cdk.Fn.importValue(createNameScoped('endpoint', props)),
        securityGroups: [securityGroup],
      },
    );
    return { proxy };
  }
}
