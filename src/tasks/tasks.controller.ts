import { Controller, Body, Get, Post, Patch, Delete, UseInterceptors, UploadedFiles, ValidationPipe, UsePipes, ParseIntPipe, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDto } from './dto/create-task.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Task } from './tasks.entity';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getAllTasks(): Promise<Task[]> {
        return this.taskService.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UseInterceptors(FilesInterceptor('image'))
    @UsePipes(ValidationPipe)
    createTask(
        @Body() task: createTaskDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<Task> {
        return this.taskService.createTask(task);
    }

    @Patch(':id')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('title') title: string
    ): Promise<Task> {
        return this.taskService.updateTask(id, title);
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.taskService.deleteTask(id);
    }
}
