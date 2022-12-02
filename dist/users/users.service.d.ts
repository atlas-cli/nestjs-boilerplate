import { Repository } from 'typeorm';
import { EntityCondition } from './../common/utils/types/entity-condition.type';
import { IPaginationOptions } from './../common/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createProfileDto: CreateUserDto): Promise<User>;
    findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]>;
    findOne(fields: EntityCondition<User>): Promise<User>;
    update(id: number, updateProfileDto: UpdateUserDto): Promise<User>;
    softDelete(id: number): Promise<void>;
}
