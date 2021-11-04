import { Module } from '@nestjs/common';
import { AppController,ConvertController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController,ConvertController ],
  providers: [AppService],
})
export class AppModule {}
