import { EntityHelper } from './../../common/utils/entity-helper';
import { Role } from './../../common/roles/entities/role.entity';
import { Status } from './../../common/statuses/entities/status.entity';
export declare class User extends EntityHelper {
    id: number;
    email: string | null;
    password: string;
    previousPassword: string;
    loadPreviousPassword(): void;
    setPassword(): Promise<void>;
    provider: string;
    socialId: string | null;
    firstName: string | null;
    lastName: string | null;
    role?: Role | null;
    status?: Status;
    hash: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
