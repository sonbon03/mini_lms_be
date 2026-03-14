import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { DayOfWeek } from './entities/class.entity';

@ApiTags('Classes')
@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List classes, optionally filter by day' })
  @ApiQuery({ name: 'day', enum: DayOfWeek, required: false })
  findAll(@Query('day') day?: DayOfWeek) {
    return this.classesService.findAll(day);
  }
}
