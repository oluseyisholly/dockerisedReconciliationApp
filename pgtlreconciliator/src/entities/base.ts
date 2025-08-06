import { Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, Entity } from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @CreateDateColumn({ type: 'timestamp' , nullable: true})
  updatedAt: string;

  @Column({  nullable: true }) // Allows null and limits length to 10
  createdBy: string;

  @Column({ nullable: true }) // Allows null and limits length to 10
  updatedBy: string;

}

