import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CUDDate {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
