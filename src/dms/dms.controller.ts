import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DmsService } from './dms.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';

@ApiTags('DM')
@Controller('workspaces/:url/dms')
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  @Post(':id/chats')
  create(@Body() createDmDto: CreateDmDto) {
    return this.dmsService.create(createDmDto);
  }

  @Get()
  findAll() {
    return this.dmsService.findAll();
  }

  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @Get(':id/chats')
  findOne(@Query() query, @Param('id') id: string) {
    console.log(query.perPage, query.page);
    return this.dmsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDmDto: UpdateDmDto) {
    return this.dmsService.update(+id, updateDmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dmsService.remove(+id);
  }
}
