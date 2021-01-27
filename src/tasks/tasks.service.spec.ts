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
  delete: jest.fn(),
  update: jest.fn(),
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
      expect(taskRepository.createTask).not.toHaveBeenCalled();
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
  describe('deleteTask', () => {
    it('delete a task', async () => {
      expect(taskRepository.delete).not.toHaveBeenCalled();
      const res = {
        raw: [],
        affected: 1,
      };
      taskRepository.delete.mockResolvedValue(res);
      const result = await tasksService.deleteTaskById(1, mockUser);
      expect(result.affected).toEqual(res.affected);
      expect(taskRepository.delete).toHaveBeenCalled();
    });
    it('throw an error', () => {
      taskRepository.delete.mockResolvedValue({
        raw: [],
        affected: 0,
      });
      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('update task', () => {
    it('update task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const updatedTask = await tasksService.updateTaskStatusById(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(updatedTask.status).toEqual(TaskStatus.DONE);
    });
  });
});
