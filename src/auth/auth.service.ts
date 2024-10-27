import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import Codes from 'src/entities/codes.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly user_service: UsersService,
    private readonly jwt_service: JwtService,
    @InjectRepository(Codes)
    private readonly codes_repository: Repository<Codes>,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.user_service.findUserByEmail(registerDto.email);

    if (user) throw new HttpException(`USER ALREADY EXISTS!`, 400);

    registerDto.password = await bcrypt.hash(
      registerDto.password,
      +process.env.HASHING_TIMES,
    );

    // send welcome email after register is completed
    setImmediate(async () => {
      await this.mailerService.sendMail({
        text: 'welcome to our website',
        subject: 'welcome',
        to: registerDto.email,
        template: 'welcome.html',
        context: {
          name: registerDto.first_name,
          family: registerDto.last_name,
        },
      });
    });

    return await this.user_service.createUser(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.user_service.findUserByEmail(loginDto.email);

    if (!user) throw new HttpException(`USER NOT FOUND!`, 404);

    // const isPasswordMatching = await bcrypt.compare(
    //   loginDto.password,
    //   user.password,
    // );

    // if (!isPasswordMatching)
    //   throw new HttpException(`PASSWORD IS INCORRECT!`, 401);

    if (loginDto.code) {
      // if user send code
      // check if code exists in DB & be valid
      const checkCode = await this.codes_repository.findOne({
        where: {
          code: loginDto.code,
          email: loginDto.email,
          is_used: false,
        },
      });

      if (checkCode) {
        await this.codes_repository.update(checkCode, { is_used: true });

        const accessToken = await this.jwt_service.sign(
          {
            sub: user.id,
            email: user.email,
          },
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
          },
        );

        const refreshToken = await this.jwt_service.sign(
          {
            sub: user.id,
            email: user.email,
          },
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
          },
        );

        return {
          accessToken,
          refreshToken,
        };
      } else {
        throw new HttpException('CODE IS NOT VALID!', 400);
      }
    } else {
      // generate 5 digit OTP code
      const OTP = await this.generateOtpCode();
      // save OTP code to DB
      this.codes_repository.save({
        email: loginDto.email,
        code: OTP,
      });
      // send OTP code to user (email or SMS)
      return { code: OTP };
    }
  }

  async generateOtpCode() {
    // generate 5 digit code that is not exists in DB
    let code: number = null;
    while (!code) {
      const min = 10000;
      const max = 99999;
      const fiveDigitCode = await this.getRandomCode(min, max);
      const checkCodeExistance = await this.codes_repository.findOne({
        where: { code: fiveDigitCode },
      });

      if (!checkCodeExistance) {
        code = fiveDigitCode;
        break;
      }
    }

    return code;
  }

  async getRandomCode(min: number, max: number) {
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    return OTP;
  }
}
