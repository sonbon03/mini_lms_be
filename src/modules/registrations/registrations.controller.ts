import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { RegisterClassDto } from './dto/register-class.dto';

@ApiTags('Registrations')
@Controller('api')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post('classes/:classId/register')
  @ApiOperation({ summary: 'Register a student to a class' })
  register(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body() dto: RegisterClassDto,
  ) {
    return this.registrationsService.register(classId, dto);
  }

  @Delete('registrations/:id')
  @ApiOperation({ summary: 'Cancel a registration (refund if > 24h before class)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationsService.remove(id);
  }
}
