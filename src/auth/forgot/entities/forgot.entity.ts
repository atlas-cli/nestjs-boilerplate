import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './../../../users/entities/user.entity';
import { Allow } from 'class-validator';
import { EntityHelper } from './../../../common/utils/entity-helper';

/**
 * The Forgot class is responsible for mapping the Forgot entity with the database.
 *
 * @class
 * @public
 */
@Entity()
export class Forgot extends EntityHelper {
  /**
   * Primary Generated Column decorator for id column.
   *
   * @public
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Allow and Column decorator for hash column.
   * Index decorator for indexing hash column.
   *
   * @public
   */
  @Allow()
  @Column()
  @Index()
  hash: string;

  /**
   * Allow and ManyToOne decorator for user column.
   *
   * @public
   */
  @Allow()
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  /**
   * CreateDateColumn decorator for createdAt column.
   *
   * @public
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * DeleteDateColumn decorator for deletedAt column.
   *
   * @public
   */
  @DeleteDateColumn()
  deletedAt: Date;
}
