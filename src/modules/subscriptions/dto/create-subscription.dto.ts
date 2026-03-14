import { IsDateString, IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'uuid-of-student' })
  @IsUUID()
  @IsNotEmpty()
  student_id!: string;

  @ApiProperty({ example: 'Goi 20 buoi' })
  @IsString()
  @IsNotEmpty()
  package_name!: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  total_sessions!: number;

  @ApiProperty({ example: '2026-06-30' })
  @IsDateString()
  @IsNotEmpty()
  expiry_date!: string;
}
