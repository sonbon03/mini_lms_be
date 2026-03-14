import { IsEnum, IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: 'Nguyen Van B' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '2015-06-15' })
  @IsDateString()
  @IsNotEmpty()
  dob!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: '5' })
  @IsString()
  @IsNotEmpty()
  current_grade!: string;

  @ApiProperty({ example: 'uuid-of-parent' })
  @IsUUID()
  @IsNotEmpty()
  parent_id!: string;
}
