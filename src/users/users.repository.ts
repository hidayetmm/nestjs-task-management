import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { PGError } from 'src/postgres-errors/error-codes.enum';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = this.create({ username, password, role: 'USER' });
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role, password, ...rest } = await this.save(user);
      return rest;
    } catch (error) {
      console.log(error);
      if (error.code === PGError.UNIQUE_VIOLATION) {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
