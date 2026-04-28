import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MyConfigModule } from './infrastructure/config/config.module';

@Module({
  imports: [
    MyConfigModule,
    AuthModule
  ]
})
export class AppModule {}
