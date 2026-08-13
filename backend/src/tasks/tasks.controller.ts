import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string, @Query('search') search?: string) {
    return this.tasksService.findAll(projectId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(
    @Body()
    data: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
      projectId?: string;
      assigneeId?: string;
      reporterId?: string;
    },
  ) {
    return this.tasksService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
      projectId?: string;
      assigneeId?: string;
      reporterId?: string;
    },
  ) {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  // --- Subtasks ---
  @Post(':id/subtasks')
  addSubtask(
    @Param('id') taskId: string,
    @Body() data: { title: string; priority?: string; dueDate?: string },
  ) {
    return this.tasksService.addSubtask(taskId, data);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @Param('subtaskId') subtaskId: string,
    @Body() data: { title?: string; isCompleted?: boolean; priority?: string; dueDate?: string },
  ) {
    return this.tasksService.updateSubtask(subtaskId, data);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(@Param('subtaskId') subtaskId: string) {
    return this.tasksService.removeSubtask(subtaskId);
  }

  // --- Comments ---
  @Post(':id/comments')
  addComment(@Param('id') taskId: string, @Body() data: { content: string; userId: string }) {
    return this.tasksService.addComment(taskId, data);
  }
}
