import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(projectId?: string, search?: string): Promise<({
        comments: ({
            user: {
                id: string;
                email: string | null;
                name: string;
                avatarUrl: string | null;
                isGuest: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        })[];
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            leadId: string | null;
        } | null;
        assignee: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reporter: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            title: string;
            taskId: string;
            isCompleted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        description: string | null;
        status: string;
        projectId: string | null;
        assigneeId: string | null;
        reporterId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        comments: ({
            user: {
                id: string;
                email: string | null;
                name: string;
                avatarUrl: string | null;
                isGuest: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        })[];
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            leadId: string | null;
        } | null;
        assignee: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reporter: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            title: string;
            taskId: string;
            isCompleted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        description: string | null;
        status: string;
        projectId: string | null;
        assigneeId: string | null;
        reporterId: string | null;
    }) | null>;
    create(data: {
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
        projectId?: string;
        assigneeId?: string;
        reporterId?: string;
    }): Promise<{
        comments: ({
            user: {
                id: string;
                email: string | null;
                name: string;
                avatarUrl: string | null;
                isGuest: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        })[];
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            leadId: string | null;
        } | null;
        assignee: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reporter: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            title: string;
            taskId: string;
            isCompleted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        description: string | null;
        status: string;
        projectId: string | null;
        assigneeId: string | null;
        reporterId: string | null;
    }>;
    update(id: string, data: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
        projectId?: string;
        assigneeId?: string;
        reporterId?: string;
    }): Promise<{
        comments: ({
            user: {
                id: string;
                email: string | null;
                name: string;
                avatarUrl: string | null;
                isGuest: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        })[];
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            leadId: string | null;
        } | null;
        assignee: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reporter: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string;
            dueDate: Date | null;
            title: string;
            taskId: string;
            isCompleted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        description: string | null;
        status: string;
        projectId: string | null;
        assigneeId: string | null;
        reporterId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        description: string | null;
        status: string;
        projectId: string | null;
        assigneeId: string | null;
        reporterId: string | null;
    }>;
    addSubtask(taskId: string, data: {
        title: string;
        priority?: string;
        dueDate?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        taskId: string;
        isCompleted: boolean;
    }>;
    updateSubtask(subtaskId: string, data: {
        title?: string;
        isCompleted?: boolean;
        priority?: string;
        dueDate?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        taskId: string;
        isCompleted: boolean;
    }>;
    removeSubtask(subtaskId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        taskId: string;
        isCompleted: boolean;
    }>;
    addComment(taskId: string, data: {
        content: string;
        userId: string;
    }): Promise<{
        user: {
            id: string;
            email: string | null;
            name: string;
            avatarUrl: string | null;
            isGuest: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        taskId: string;
        userId: string;
    }>;
}
