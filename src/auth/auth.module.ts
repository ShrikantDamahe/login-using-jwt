import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [LoginController],

  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'shrikant',
        signOptions: { expiresIn: '5d' },
      }),
    }),
  ],
})
export class AuthModule {}
