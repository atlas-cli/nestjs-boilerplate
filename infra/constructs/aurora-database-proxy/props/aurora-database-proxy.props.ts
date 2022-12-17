import { DatabaseCluster } from "aws-cdk-lib/aws-rds";
import { ApplicationProps } from "../../../props/application.props";
import { AuroraDatabaseVpc } from "../../aurora-database-vpc/aurora-database-vpc.construct";

export interface AuroraDatabaseProxyProps extends ApplicationProps {
    auroraDatabaseVpc: AuroraDatabaseVpc;
    auroraDatabaseCluster: DatabaseCluster;
}