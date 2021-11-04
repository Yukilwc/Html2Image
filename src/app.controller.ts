import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}


@Controller("convert")
export class ConvertController {
  @Get("image")
  html2image():string {
    return 'html2image'
  }
}