import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getOrCreateGuest(name?: string) {
    // Check if there is an existing guest user with this name
    const guestName = name || 'Guest';
    let guestUser = await this.prisma.user.findFirst({
      where: { name: guestName, isGuest: true },
    });

    if (!guestUser) {
      guestUser = await this.prisma.user.create({
        data: {
          name: guestName,
          isGuest: true,
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${guestName}-${Date.now()}`,
        },
      });
    }
    return guestUser;
  }
}
