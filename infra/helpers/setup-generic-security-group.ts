import * as cdk from 'aws-cdk-lib';
import { ISecurityGroup, IVpc, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { GenericSecurityGroupProps } from '../props/generic-security-group-props';
import { createOutput } from './create-output';

const defaultVpc = (scope: Construct, scopedName: string): IVpc => {
    // Lookup and return the default VPC
    return Vpc.fromLookup(scope, `${scopedName}DefaultVpc`, { isDefault: true });
};

const createSecurityGroup = (
    scope: Construct,
    securityGroupId: string,
    vpc: IVpc,
    props: GenericSecurityGroupProps
): SecurityGroup => {
    // Create and return a new security group
    return new SecurityGroup(scope, securityGroupId, {
        securityGroupName: securityGroupId,
        vpc,
        allowAllOutbound: true,
        ...props,
    });
};

const exportResources = (
    scope: Construct,
    scopedName: string,
    vpc: IVpc,
    securityGroup: ISecurityGroup
): void => {
    // Export the VPC ID
    createOutput(scope, `${scopedName}VpcId`, vpc.vpcId);

    // Export public subnet IDs and their route table IDs
    vpc.publicSubnets.forEach((subnet, index) => {
        createOutput(scope, `${scopedName}GenericSubnetId${index + 1}`, subnet.subnetId);
        createOutput(scope, `${scopedName}GenericSubnetRouteTableId${index + 1}`, subnet.routeTable.routeTableId);
    });

    // Export private subnet IDs and their route table IDs
    vpc.privateSubnets.forEach((subnet, index) => {
        createOutput(scope, `${scopedName}GenericPrivateSubnetId${index + 1}`, subnet.subnetId);
        createOutput(scope, `${scopedName}GenericPrivateSubnetRouteTableId${index + 1}`, subnet.routeTable.routeTableId);
    });

    // Export the security group ID
    createOutput(scope, `${scopedName}GenericSecurityGroupId`, securityGroup.securityGroupId);
};

export const    importGenericSecurityGroupResources = (
    scope: Construct,
    scopedName: string
): { vpc: IVpc, securityGroup: ISecurityGroup } => {
    // Import the VPC using its attributes
    const vpc = Vpc.fromVpcAttributes(scope, `${scopedName}VpcId`, {
        vpcId: cdk.Fn.importValue(`${scopedName}VpcId`),
        availabilityZones: [0, 1].map(i => cdk.Fn.select(i, cdk.Fn.getAzs())),
        publicSubnetIds: [
            cdk.Fn.importValue(`${scopedName}GenericSubnetId1`),
            cdk.Fn.importValue(`${scopedName}GenericSubnetId2`),
        ],
        publicSubnetRouteTableIds: [
            cdk.Fn.importValue(`${scopedName}GenericSubnetRouteTableId1`),
            cdk.Fn.importValue(`${scopedName}GenericSubnetRouteTableId2`),
        ],
        privateSubnetIds: [
            cdk.Fn.importValue(`${scopedName}GenericPrivateSubnetId1`),
            cdk.Fn.importValue(`${scopedName}GenericPrivateSubnetId2`),
        ],
        privateSubnetRouteTableIds: [
            cdk.Fn.importValue(`${scopedName}GenericPrivateSubnetRouteTableId1`),
            cdk.Fn.importValue(`${scopedName}GenericPrivateSubnetRouteTableId2`),
        ],
    });

    // Import the security group using its ID
    const securityGroup = SecurityGroup.fromSecurityGroupId(
        scope,
        `${scopedName}GenericSecurityGroupId`,
        cdk.Fn.importValue(`${scopedName}GenericSecurityGroupId`),
    );

    return {
        vpc,
        securityGroup,
    };
};

const createAndExportGenericSecurityGroup = (
    scope: Construct,
    securityGroupId: string,
    props: GenericSecurityGroupProps,
): { vpc: IVpc, securityGroup: ISecurityGroup } => {
    // Create or lookup the VPC
    const vpc = props.vpc ?? defaultVpc(scope, securityGroupId);

    // Create the security group
    const securityGroup = createSecurityGroup(scope, securityGroupId, vpc, props);

    // Export the resources
    exportResources(scope, securityGroupId, vpc, securityGroup);

    return {
        vpc,
        securityGroup,
    };
};

export { createAndExportGenericSecurityGroup };
