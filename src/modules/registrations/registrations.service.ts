import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClassRegistration } from './entities/class-registration.entity';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { RegisterClassDto } from './dto/register-class.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(ClassRegistration)
    private readonly regRepo: Repository<ClassRegistration>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    private readonly dataSource: DataSource,
  ) {}

  async register(
    classId: string,
    dto: RegisterClassDto,
  ): Promise<ClassRegistration> {
    return this.dataSource.transaction(async (manager) => {
      // Find the class
      const cls = await manager.findOne(Class, { where: { id: classId } });
      if (!cls) {
        throw new NotFoundException('Class not found');
      }

      // Find the student
      const student = await manager.findOne(Student, {
        where: { id: dto.student_id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Check 1: Max students
      const currentCount = await manager.count(ClassRegistration, {
        where: { class_id: classId },
      });
      if (currentCount >= cls.max_students) {
        throw new BadRequestException('Class is full');
      }

      // Check duplicate registration
      const existing = await manager.findOne(ClassRegistration, {
        where: { class_id: classId, student_id: dto.student_id },
      });
      if (existing) {
        throw new BadRequestException(
          'Student is already registered for this class',
        );
      }

      // Check 2: Schedule conflict
      const studentRegistrations = await manager.find(ClassRegistration, {
        where: { student_id: dto.student_id },
        relations: ['classEntity'],
      });

      for (const reg of studentRegistrations) {
        if (
          reg.classEntity.day_of_week === cls.day_of_week &&
          this.hasTimeOverlap(reg.classEntity.time_slot, cls.time_slot)
        ) {
          throw new BadRequestException(
            `Schedule conflict with class "${reg.classEntity.name}" on ${cls.day_of_week} at ${reg.classEntity.time_slot}`,
          );
        }
      }

      // Check 3: Active subscription
      const today = new Date().toISOString().split('T')[0]!;
      const subscriptions = await manager.find(Subscription, {
        where: { student_id: dto.student_id },
      });

      const activeSub = subscriptions.find(
        (s) => s.expiry_date >= today && s.used_sessions < s.total_sessions,
      );

      if (!activeSub) {
        throw new BadRequestException(
          'Student has no active subscription',
        );
      }

      // Create registration
      const registration = manager.create(ClassRegistration, {
        class_id: classId,
        student_id: dto.student_id,
      });

      return manager.save(ClassRegistration, registration);
    });
  }

  async remove(id: string): Promise<{ refunded: boolean; message: string }> {
    return this.dataSource.transaction(async (manager) => {
      const reg = await manager.findOne(ClassRegistration, {
        where: { id },
        relations: ['classEntity'],
      });
      if (!reg) {
        throw new NotFoundException('Registration not found');
      }

      // Calculate next class datetime
      const now = new Date();
      const nextClassDate = this.getNextClassDate(
        reg.classEntity.day_of_week,
        reg.classEntity.time_slot,
      );

      const hoursUntilClass =
        (nextClassDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      let refunded = false;

      if (hoursUntilClass > 24) {
        // > 24h before class: refund 1 session
        const today = new Date().toISOString().split('T')[0]!;
        const subscriptions = await manager.find(Subscription, {
          where: { student_id: reg.student_id },
        });

        const activeSub = subscriptions.find(
          (s) => s.expiry_date >= today && s.used_sessions > 0,
        );

        if (activeSub) {
          activeSub.used_sessions -= 1;
          await manager.save(Subscription, activeSub);
          refunded = true;
        }
      }

      await manager.remove(ClassRegistration, reg);

      return {
        refunded,
        message: refunded
          ? 'Registration cancelled. 1 session refunded.'
          : 'Registration cancelled. No refund (less than 24h before class).',
      };
    });
  }

  private getNextClassDate(dayOfWeek: string, timeSlot: string): Date {
    const dayMap: Record<string, number> = {
      sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
    };

    const targetDay = dayMap[dayOfWeek]!;
    const [startTime] = timeSlot.split('-');
    const [hours, minutes] = startTime!.split(':').map(Number);

    const now = new Date();
    const result = new Date(now);
    result.setHours(hours!, minutes!, 0, 0);

    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;

    if (daysUntil < 0) {
      daysUntil += 7;
    } else if (daysUntil === 0 && result <= now) {
      daysUntil = 7;
    }

    result.setDate(result.getDate() + daysUntil);
    return result;
  }

  private hasTimeOverlap(slot1: string, slot2: string): boolean {
    const parse = (slot: string) => {
      const [start, end] = slot.split('-');
      return {
        start: this.timeToMinutes(start!),
        end: this.timeToMinutes(end!),
      };
    };

    const a = parse(slot1);
    const b = parse(slot2);

    return a.start < b.end && b.start < a.end;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours! * 60 + minutes!;
  }
}
