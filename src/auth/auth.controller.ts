import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('ayush')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body(ValidationPipe) createLoginDto: CreateDto) {
    return await this.authService.createUser(createLoginDto);
  }

  @Post('login')
  async loginUser(@Body(ValidationPipe) loginUserDto: LoginDto) {
    const user = await this.authService.validateUser(loginUserDto);
    return { access_token: await this.authService.login(user) };
  }
}
