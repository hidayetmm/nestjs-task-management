import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from '../auth/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  getUsers(@GetUser() user: User): // @Query() filterDto: GetUsersFilterDto,
  Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  // @Roles(Role.ADMIN)
  @ApiBearerAuth()
  getUserById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): // @Query() filterDto: GetUsersFilterDto,
  Promise<User> {
    return this.usersService.getUserById(id, user);
  }
}
