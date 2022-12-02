import { User } from './../../../../users/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserSeedService {
    private repository;
    constructor(repository: Repository<User>);
    run(): Promise<void>;
}
