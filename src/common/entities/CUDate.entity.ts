import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CUDate {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
