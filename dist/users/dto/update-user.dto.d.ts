import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/common/roles/entities/role.entity';
import { Status } from 'src/common/statuses/entities/status.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    email?: string | null;
    password?: string;
    provider?: string;
    socialId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: Role | null;
    status?: Status;
    hash?: string | null;
}
export {};
