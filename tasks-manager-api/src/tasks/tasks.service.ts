import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async getTask(id: string): Promise<Task> {
    return this.taskModel.findById(id);
  }

  async create(createCatDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createCatDto);
    return createdTask.save();
  }

  async update(createCatDto: CreateTaskDto, _id: string): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(_id, createCatDto, {
      new: true,
    });
  }

  async delete(_id): Promise<Task> {
    return this.taskModel.findOneAndDelete(_id);
  }
}
