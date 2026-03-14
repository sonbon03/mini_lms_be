import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/class.entity';

export class CreateClassDto {
  @ApiProperty({ example: 'Toan Nang Cao' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.MON })
  @IsEnum(DayOfWeek)
  day_of_week!: DayOfWeek;

  @ApiProperty({ example: '08:00-09:30' })
  @IsString()
  @IsNotEmpty()
  time_slot!: string;

  @ApiProperty({ example: 'Tran Van C' })
  @IsString()
  @IsNotEmpty()
  teacher_name!: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(1)
  max_students!: number;
}
