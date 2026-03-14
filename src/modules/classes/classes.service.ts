import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, DayOfWeek } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateClassDto): Promise<Class> {
    const cls = this.classRepo.create(dto);
    return this.classRepo.save(cls);
  }

  async findAll(day?: DayOfWeek): Promise<Class[]> {
    const options = {
      relations: ['registrations', 'registrations.student'],
      ...(day ? { where: { day_of_week: day } } : {}),
    };
    return this.classRepo.find(options);
  }

  async findOne(id: string): Promise<Class> {
    const cls = await this.classRepo.findOne({
      where: { id },
      relations: ['registrations', 'registrations.student'],
    });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }
}
