import { ApplicationProps } from "../../../props/application.props";
import { AuroraDatabaseVpc } from "../../aurora-database-vpc/aurora-database-vpc.construct";

export interface AuroraDatabaseProps extends ApplicationProps {
    auroraDatabaseVpc?: AuroraDatabaseVpc;
}