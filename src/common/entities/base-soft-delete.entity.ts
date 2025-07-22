import { DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseSoftDeleteEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt?: Date;
}