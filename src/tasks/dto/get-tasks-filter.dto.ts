import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsString()
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
