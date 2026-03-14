import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassRegistration } from '../../registrations/entities/class-registration.entity';

export enum DayOfWeek {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  subject!: string;

  @Column({ type: 'enum', enum: DayOfWeek })
  day_of_week!: DayOfWeek;

  @Column()
  time_slot!: string;

  @Column()
  teacher_name!: string;

  @Column()
  max_students!: number;

  @OneToMany(() => ClassRegistration, (reg) => reg.classEntity)
  registrations!: ClassRegistration[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
