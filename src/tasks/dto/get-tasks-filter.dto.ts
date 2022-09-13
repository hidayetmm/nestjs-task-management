import { TaskStatus } from '../task-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsString()
  status?: TaskStatus;

  @IsString()
  search?: string;
}
