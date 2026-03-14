import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const student = await this.studentRepo.findOne({
      where: { id: dto.student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const sub = this.subRepo.create(dto);
    return this.subRepo.save(sub);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subRepo.find({ relations: ['student'] });
  }

  async findOne(id: string): Promise<Subscription> {
    const sub = await this.subRepo.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }
    return sub;
  }

  async useSession(id: string): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id } });
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    const today = new Date().toISOString().split('T')[0];
    if (sub.expiry_date < today!) {
      throw new BadRequestException('Subscription has expired');
    }
    if (sub.used_sessions >= sub.total_sessions) {
      throw new BadRequestException('All sessions have been used');
    }

    sub.used_sessions += 1;
    return this.subRepo.save(sub);
  }
}
