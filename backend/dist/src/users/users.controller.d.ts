import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getOrCreateGuest(name?: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        avatarUrl: string | null;
        isGuest: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
