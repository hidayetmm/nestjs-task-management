import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthResponseType } from '../types/return-types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthResponseType> {
    const user = await this.usersRepository.createUser(authCredentialsDto);
    const payload: JwtPayload = { username: user.username };
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { ...user, accessToken };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthResponseType> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return { ...rest, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }
}
