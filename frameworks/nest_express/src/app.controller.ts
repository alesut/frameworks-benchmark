import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('metrics')
  getMetrics(): object {
    return this.appService.getMetrics();
  }

  @Get('timeout')
  getTimeout(): object {
    return this.appService.getTimeout();
  }
}
