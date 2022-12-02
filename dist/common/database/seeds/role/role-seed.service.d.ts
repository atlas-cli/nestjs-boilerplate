import { Role } from './../../../roles/entities/role.entity';
import { Repository } from 'typeorm';
export declare class RoleSeedService {
    private repository;
    constructor(repository: Repository<Role>);
    run(): Promise<void>;
}
