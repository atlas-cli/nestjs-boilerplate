import { DeepPartial } from './../../common/utils/types/deep-partial.type';
import { FindOptions } from './../../common/utils/types/find-options.type';
import { Repository } from 'typeorm';
import { Forgot } from './entities/forgot.entity';
export declare class ForgotService {
    private forgotRepository;
    constructor(forgotRepository: Repository<Forgot>);
    findOne(options: FindOptions<Forgot>): Promise<Forgot>;
    findMany(options: FindOptions<Forgot>): Promise<Forgot[]>;
    create(data: DeepPartial<Forgot>): Promise<Forgot>;
    softDelete(id: number): Promise<void>;
}
