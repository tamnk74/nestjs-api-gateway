import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth';
import { AppController } from './controllers';
import { LoggerModule } from 'src/common/logger';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
