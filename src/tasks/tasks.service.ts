import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { createTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {}

    getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async getTaskById(id: number): Promise<Task> {
        const result = await this.taskRepository.findOneBy({id});

        if(!result) {
            throw new NotFoundException(`Task not found`);
        }

        return result;
    }

    async createTask(createTaskDto: createTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;

        await task.save()

        return task;
    }

    async updateTask(id: number, title: string): Promise<Task> {
        const task = await this.getTaskById(id);
        task.title = title;
        await task.save();
        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task not found`);
        }
    }
}
