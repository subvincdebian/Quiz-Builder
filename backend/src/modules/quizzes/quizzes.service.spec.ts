import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesService } from './quizzes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('QuizzesService', () => {
  let service: QuizzesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let cacheManager: Cache;

  const mockPrismaService = {
    quiz: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<QuizzesService>(QuizzesService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return cached data if available', async () => {
    const cachedQuizzes = [{ id: '1', title: 'Test Quiz' }];
    mockCacheManager.get.mockResolvedValue(cachedQuizzes);

    const result = await service.findAll();
    expect(result).toEqual(cachedQuizzes);
    expect(mockCacheManager.get).toHaveBeenCalledWith('/quizzes');
  });

  it('findAll should fetch from DB if cache miss', async () => {
    const dbQuizzes = [{ id: '1', title: 'Test Quiz' }];
    mockCacheManager.get.mockResolvedValue(null);
    mockPrismaService.quiz.findMany.mockResolvedValue(dbQuizzes);

    const result = await service.findAll();
    expect(result).toEqual(dbQuizzes);
    expect(mockCacheManager.set).toHaveBeenCalled();
  });
});
