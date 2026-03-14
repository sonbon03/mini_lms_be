import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { Parent } from '../parents/entities/parent.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const parent = await this.parentRepo.findOne({
      where: { id: dto.parent_id },
    });
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepo.find({ relations: ['parent'] });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }
}
