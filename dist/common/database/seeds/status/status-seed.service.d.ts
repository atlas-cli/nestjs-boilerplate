import { Status } from './../../../statuses/entities/status.entity';
import { Repository } from 'typeorm';
export declare class StatusSeedService {
    private repository;
    constructor(repository: Repository<Status>);
    run(): Promise<void>;
}
