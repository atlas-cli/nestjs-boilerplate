import { ApplicationProps } from "../../../props/appplication.props";
import { AuroraDatabaseVpc } from "../../aurora-database-vpc/aurora-database-vpc.construct";

export interface AuroraDatabaseProps extends ApplicationProps {
    auroraDatabaseVpc?: AuroraDatabaseVpc;
}