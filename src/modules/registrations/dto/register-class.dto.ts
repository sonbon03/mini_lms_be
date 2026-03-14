import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClassDto {
  @ApiProperty({ example: 'uuid-of-student' })
  @IsUUID()
  @IsNotEmpty()
  student_id!: string;
}
