import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  student_id!: string;

  @Column()
  package_name!: string;

  @Column()
  total_sessions!: number;

  @Column({ default: 0 })
  used_sessions!: number;

  @Column({ type: 'date' })
  expiry_date!: string;

  @ManyToOne(() => Student, (student) => student.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
