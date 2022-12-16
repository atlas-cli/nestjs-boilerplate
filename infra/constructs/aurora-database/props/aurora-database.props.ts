import { AuroraDatabaseVpc } from "../../aurora-database-vpc/aurora-database-vpc.construct";

export interface AuroraDatabaseProps {
    auroraDatabaseVpc?: AuroraDatabaseVpc;
}