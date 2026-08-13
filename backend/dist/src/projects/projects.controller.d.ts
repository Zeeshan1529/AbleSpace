import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<({
        lead: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        lead: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string | null;
    }) | null>;
    create(data: {
        name: string;
        priority?: string;
        leadId?: string;
        dueDate?: string;
    }): Promise<{
        lead: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string | null;
    }>;
}
