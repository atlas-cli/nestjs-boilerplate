import { DatabaseCluster } from "aws-cdk-lib/aws-rds";
import { AuroraDatabaseVpc } from "../../aurora-database-vpc/aurora-database-vpc.construct";

export interface AuroraDatabaseProxyProps {
    auroraDatabaseVpc?: AuroraDatabaseVpc;
    auroraDatabaseCluster: DatabaseCluster;
}