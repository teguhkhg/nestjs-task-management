import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
});

const userData = {
  id: 'someId',
  username: 'username',
  password: 'hashedPassword',
};

const taskData = {
  id: 'someId',
  title: 'title',
  description: 'description',
  status: TaskStatus.OPEN,
};

const mockUser = {
  ...userData,
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('should returns the result when succeded', async () => {
      tasksRepository.getTasks.mockResolvedValue([taskData]);
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual([taskData]);
    });
  });

  describe('getTaskById', () => {
    it('should throw not found when use is not found', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTaskById('test', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should returns the result when succeeded', async () => {
      tasksRepository.findOneBy.mockResolvedValue(taskData);
      const result = await tasksService.getTaskById('test', mockUser);
      expect(result).toEqual(taskData);
    });
  });
});
