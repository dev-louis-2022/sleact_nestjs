import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('CUSTOM_KEY') private readonly customValue: string,
  ) {}
  getHello(): string {
    //return this.configService.get('MESSAGE');
    return this.customValue;
  }
}
