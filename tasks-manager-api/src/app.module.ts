import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      // `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_USER}`,
      // `mongodb://admin:admin@localhost:27110/tasks_manager?authSource=admin`,
      `mongodb://admin:admin@tasks-mongo-manager:27017/tasks_manager?authSource=admin`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
