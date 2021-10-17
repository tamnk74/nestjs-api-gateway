/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { UserController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: [join(__dirname, './protos/user.proto')],
          url: '0.0.0.0:5000',
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRED_TIME', '1h') },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
