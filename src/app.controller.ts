import { Controller, Get } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { MorganInterceptor } from 'nest-morgan/morgan.interceptor.mixin';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(MorganInterceptor('combined'))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
