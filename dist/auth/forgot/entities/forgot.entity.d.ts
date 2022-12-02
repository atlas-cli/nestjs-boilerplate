import { User } from './../../../users/entities/user.entity';
import { EntityHelper } from './../../../common/utils/entity-helper';
export declare class Forgot extends EntityHelper {
    id: number;
    hash: string;
    user: User;
    createdAt: Date;
    deletedAt: Date;
}
