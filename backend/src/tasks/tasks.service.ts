import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId?: string, search?: string) {
    const where: any = {};
    if (projectId) {
      where.projectId = projectId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return this.prisma.task.findMany({
      where,
      include: {
        project: true,
        assignee: true,
        reporter: true,
        subtasks: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        subtasks: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    projectId?: string;
    assigneeId?: string;
    reporterId?: string;
  }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || 'Todo',
        priority: data.priority || 'None',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId || null,
        assigneeId: data.assigneeId || null,
        reporterId: data.reporterId || null,
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        subtasks: true,
        comments: {
          include: { user: true },
        },
      },
    });
  }

  async update(
    id: string,
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
    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        assignee: true,
        reporter: true,
        subtasks: true,
        comments: {
          include: { user: true },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  // --- Subtasks ---
  async addSubtask(taskId: string, data: { title: string; priority?: string; dueDate?: string }) {
    return this.prisma.subtask.create({
      data: {
        title: data.title,
        priority: data.priority || 'None',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        taskId,
      },
    });
  }

  async updateSubtask(
    subtaskId: string,
    data: { title?: string; isCompleted?: boolean; priority?: string; dueDate?: string },
  ) {
    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: updateData,
    });
  }

  async removeSubtask(subtaskId: string) {
    return this.prisma.subtask.delete({
      where: { id: subtaskId },
    });
  }

  // --- Comments ---
  async addComment(taskId: string, data: { content: string; userId: string }) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        userId: data.userId,
      },
      include: {
        user: true,
      },
    });
  }
}
