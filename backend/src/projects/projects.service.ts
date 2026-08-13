import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
      },
    });
  }

  async create(data: { name: string; priority?: string; leadId?: string; dueDate?: string }) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        priority: data.priority || 'Medium',
        leadId: data.leadId || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        lead: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
