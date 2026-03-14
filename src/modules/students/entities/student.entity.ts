import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Parent } from '../../parents/entities/parent.entity';
import { ClassRegistration } from '../../registrations/entities/class-registration.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  dob!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column()
  current_grade!: string;

  @Column()
  parent_id!: string;

  @ManyToOne(() => Parent, (parent) => parent.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent!: Parent;

  @OneToMany(() => ClassRegistration, (reg) => reg.student)
  registrations!: ClassRegistration[];

  @OneToMany(() => Subscription, (sub) => sub.student)
  subscriptions!: Subscription[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
