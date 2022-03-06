import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  private userService: UserService;

  constructor(
    @Inject('USER_PACKAGE') private readonly clientService: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.clientService.getService<UserService>('UserService');
  }

  @Post('/register')
  register(@Body() registerInput: unknown) {
    return this.userService.registerUser(registerInput);
  }
}
