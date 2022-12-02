import { IPaginationOptions } from './types/pagination-options';
export declare const infinityPagination: <T>(data: T[], options: IPaginationOptions) => {
    data: T[];
    hasNextPage: boolean;
};
