import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigValidationSchema } from './config.schema';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { UsersRepository } from 'src/auth/users.repository';
import { TasksRepository } from 'src/tasks/tasks.repository';
import { AuthController } from 'src/auth/auth.controller';
import { TasksController } from 'src/tasks/tasks.controller';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.stage.${process.env.STAGE}`,
      validationSchema: ConfigValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: { ssl: isProduction ? { rejectUnauthorized: false } : null },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Task],
        };
      },
    }),
    TypeOrmExModule.forCustomRepository([UsersRepository, TasksRepository]),
  ],
  controllers: [AuthController, TasksController],
})
export class AppModule {}
