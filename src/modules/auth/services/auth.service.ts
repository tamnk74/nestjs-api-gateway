import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService } from '../dtos/interfaces/user.service';
import { LoginDto } from '../dtos/requests/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../dtos/responses';
import { UnauthorizedException } from 'src/exceptions';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserService;
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async findUser(userId: string): Promise<unknown> {
    return this.userService.findOne(userId);
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user = await lastValueFrom(
      this.userService.findUserByEmail({ email }),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
