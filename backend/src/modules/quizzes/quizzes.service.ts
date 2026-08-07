import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from '@prisma/client';

@Injectable()
export class QuizzesService {
  private readonly logger = new Logger(QuizzesService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    try {
      return await this.prisma.quiz.create({
        data: {
          title: createQuizDto.title,
          questions: {
            create: createQuizDto.questions.map((q) => ({
              type: q.type,
              text: q.text,
              options: q.options.map((o) => o.text),
              correctAnswers: q.options
                .filter((o) => o.isCorrect)
                .map((o) => o.text),
            })),
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to create quiz', error);
      throw new InternalServerErrorException('Failed to create quiz');
    }
  }

  async findAll() {
    const cachedQuizzes = await this.cacheManager.get<Quiz[]>('/quizzes');
    if (cachedQuizzes) return cachedQuizzes;

    try {
      const quizzes = await this.prisma.quiz.findMany({
        include: { _count: { select: { questions: true } } },
      });
      await this.cacheManager.set('/quizzes', quizzes);
      return quizzes;
    } catch (error) {
      this.logger.error('Failed to fetch quizzes', error);
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  async findOne(id: string) {
    const cachedQuiz = await this.cacheManager.get<Quiz>(`/quizzes/${id}`);
    if (cachedQuiz) return cachedQuiz;

    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: { questions: true },
      });
      if (!quiz) throw new NotFoundException('Quiz not found');
      await this.cacheManager.set(`/quizzes/${id}`, quiz);
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch quiz ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.quiz.delete({ where: { id } });
      await this.cacheManager.del('/quizzes');
      await this.cacheManager.del(`/quizzes/${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete quiz ${id}`, error);
      throw new InternalServerErrorException('Failed to delete quiz');
    }
  }
}
