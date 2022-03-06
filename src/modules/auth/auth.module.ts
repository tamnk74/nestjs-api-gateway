/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { JwtStrategy } from './strategies';
import { AuthController, UserController } from './controllers';

@Module({
  imports: [
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
  controllers: [UserController, AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: [join(__dirname, './protos/user.proto')],
            url: configService.get('USER_SERVICE_URL'),
            loader: {
              defaults: true,
            },
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
