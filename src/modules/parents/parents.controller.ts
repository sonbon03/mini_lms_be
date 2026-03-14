import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';

@ApiTags('Parents')
@Controller('api/parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new parent' })
  create(@Body() dto: CreateParentDto) {
    return this.parentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parents' })
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parent by ID with students' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentsService.findOne(id);
  }
}
