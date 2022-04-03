import { Task } from './task.entity';
import { AppDataSource } from '../data-source';

export const tasksRepository = AppDataSource.getRepository(Task);
