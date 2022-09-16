import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string, user: User): Promise<User> {
    let found: User;
    if (user.role === Role.ADMIN || id === user.id) {
      found = await this.usersRepository.findOneBy({ id });
    } else {
      throw new ForbiddenException();
    }
    if (!found) {
      throw new NotFoundException(`User with ID "${id}" could not found.`);
    }
    return found;
  }
}
