import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }
  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }
  async deleteTaskById(id: number, user: User): Promise<DeleteResult> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (!result.affected)
      throw new NotFoundException(`Task with id ${id} not found`);
    return result;
  }
  async updateTaskStatusById(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task;
  }
}
