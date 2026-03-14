import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Student } from '../students/entities/student.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Student])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
