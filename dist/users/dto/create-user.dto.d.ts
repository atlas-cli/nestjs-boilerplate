import { Role } from 'src/common/roles/entities/role.entity';
import { Status } from 'src/common/statuses/entities/status.entity';
export declare class CreateUserDto {
    email: string | null;
    password?: string;
    provider?: string;
    socialId?: string | null;
    firstName: string | null;
    lastName: string | null;
    role?: Role | null;
    status?: Status;
    hash?: string | null;
}
