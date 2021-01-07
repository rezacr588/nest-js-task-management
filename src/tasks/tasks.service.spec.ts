import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-task.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
const mockTaskRepositoryFactory = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});
const mockUser = { id: 1, username: 'rezacr588' };
describe('TasksService', () => {
  let tasksService;
  let taskRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepositoryFactory },
      ],
    }).compile();
    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });
  describe('getTasks', () => {
    it('get all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('reza');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filterDto: GetTasksFilterDTO = {
        search: 'some search',
        status: TaskStatus.OPEN,
      };
      const result = await tasksService.getTasks(filterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('reza');
    });
  });
  describe('getTaskById', () => {
    it('find task and successfully returned', async () => {
      const mockTask = {
        title: 'test task',
        description: 'test description',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });
    it('not found task and throw error', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('createTask', () => {
    it('should create a task', async () => {
      const mockTask: CreateTaskDTO = {
        title: 'test task',
        description: 'test description',
      };
      taskRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockTask,
        mockUser,
      );
    });
  });
});
