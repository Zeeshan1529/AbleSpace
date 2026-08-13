import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getOrCreateGuest(name?: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
