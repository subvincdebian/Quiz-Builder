import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { validateEnv } from './modules/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    QuizzesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
