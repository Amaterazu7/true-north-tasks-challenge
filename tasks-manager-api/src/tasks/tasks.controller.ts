import {
  Controller,
  Param,
  Body,
  Delete,
  Post,
  Get,
  Put,
  Res,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':taskId')
  getTask(@Param('taskId') taskId: string): Promise<Task> {
    return this.taskService.getTask(taskId);
  }

  @Post()
  async postTask(@Res() res, @Body() task: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskService.create(task);
    return this.sendGoodResponse(res, 'Task Created Successfully', createdTask);
  }

  @Put(':_id')
  async putTask(
    @Res() res,
    @Body() task: CreateTaskDto,
    @Param() _id: string,
  ): Promise<Task> {
    const updatedTask = await this.taskService.update(task, _id);
    if (!updatedTask) throw new NotFoundException('Task does not exist!');
    return this.sendGoodResponse(res, 'Task Updated Successfully', updatedTask);
  }

  @Delete(':_id')
  async deleteTask(@Res() res, @Param() _id: string): Promise<Task> {
    const deletedTask = await this.taskService.delete(_id);
    if (!deletedTask) throw new NotFoundException('Task does not exist!');
    return this.sendGoodResponse(res, 'Task Deleted Successfully', deletedTask);
  }

  sendGoodResponse(@Res() res, msg: string, task: Task) {
    return res.status(HttpStatus.OK).json({
      message: msg,
      task,
      status: 200,
    });
  }
}
