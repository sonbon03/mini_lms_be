import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('class_registrations')
@Unique(['class_id', 'student_id'])
export class ClassRegistration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  class_id!: string;

  @Column()
  student_id!: string;

  @ManyToOne(() => Class, (cls) => cls.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  classEntity!: Class;

  @ManyToOne(() => Student, (student) => student.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @CreateDateColumn()
  registered_at!: Date;
}
