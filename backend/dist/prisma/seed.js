"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    await prisma.comment.deleteMany({});
    await prisma.subtask.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    const dexter = await prisma.user.create({
        data: {
            name: 'Dexter',
            email: 'Dexter@gmail.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Dexter',
            isGuest: false,
        },
    });
    const admin = await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@pyramid.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Admin',
            isGuest: false,
        },
    });
    const designer = await prisma.user.create({
        data: {
            name: 'Designer',
            email: 'designer@pyramid.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Designer',
            isGuest: false,
        },
    });
    const qaTeam = await prisma.user.create({
        data: {
            name: 'QA Team',
            email: 'qa@pyramid.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=QA',
            isGuest: false,
        },
    });
    const security = await prisma.user.create({
        data: {
            name: 'Security',
            email: 'security@pyramid.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Security',
            isGuest: false,
        },
    });
    const ankit = await prisma.user.create({
        data: {
            name: 'Ankit Dutta',
            email: 'ankit@pyramid.com',
            avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ankit',
            isGuest: false,
        },
    });
    console.log('Users created:', { dexter, admin, designer, qaTeam, security });
    const project1 = await prisma.project.create({
        data: {
            name: 'Design Homepage',
            priority: 'High',
            leadId: dexter.id,
            dueDate: new Date('2026-09-12'),
        },
    });
    const project2 = await prisma.project.create({
        data: {
            name: 'Develop Login Feature',
            priority: 'Low',
            leadId: admin.id,
            dueDate: new Date('2026-09-15'),
        },
    });
    const project3 = await prisma.project.create({
        data: {
            name: 'Test Payment Gateway',
            priority: 'Medium',
            leadId: qaTeam.id,
            dueDate: new Date('2026-09-18'),
        },
    });
    console.log('Projects created:', { project1, project2, project3 });
    const task1 = await prisma.task.create({
        data: {
            title: 'Write API Documentation',
            description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
            status: 'Backlog',
            priority: 'High',
            dueDate: new Date('2026-07-31'),
            projectId: project1.id,
            assigneeId: designer.id,
            reporterId: dexter.id,
        },
    });
    await prisma.subtask.createMany({
        data: [
            {
                title: 'Subtask 1',
                isCompleted: false,
                priority: 'High',
                dueDate: new Date('2026-09-12'),
                taskId: task1.id,
            },
            {
                title: 'Subtask 2',
                isCompleted: false,
                priority: 'Low',
                dueDate: new Date('2026-09-15'),
                taskId: task1.id,
            },
            {
                title: 'Subtask 3',
                isCompleted: false,
                priority: 'Medium',
                dueDate: new Date('2026-09-18'),
                taskId: task1.id,
            },
        ],
    });
    await prisma.comment.create({
        data: {
            content: 'dsds',
            taskId: task1.id,
            userId: ankit.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Implement Search Function',
            description: 'Create a search filter mechanism to quickly retrieve specific item details.',
            status: 'Todo',
            priority: 'Medium',
            dueDate: new Date('2026-07-29'),
            projectId: project1.id,
            assigneeId: admin.id,
            reporterId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Deploy to Production',
            description: 'Setup production release scripts and finalize hosting.',
            status: 'Todo',
            priority: 'Urgent',
            dueDate: new Date('2026-07-29'),
            projectId: project1.id,
            assigneeId: admin.id,
            reporterId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Code Review Completed',
            description: 'Audit the login controller code flow and database connections.',
            status: 'Doing',
            priority: 'High',
            dueDate: new Date('2026-07-29'),
            projectId: project2.id,
            assigneeId: admin.id,
            reporterId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Design Mockups Finalized',
            description: 'Upload latest high-fidelity UI mockup files.',
            status: 'Doing',
            priority: 'Medium',
            dueDate: new Date('2026-07-29'),
            projectId: project1.id,
            assigneeId: admin.id,
            reporterId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Feature Testing Passed',
            description: 'Run integration test suites for payments and receipts.',
            status: 'Completed',
            priority: 'Low',
            dueDate: new Date('2026-07-30'),
            projectId: project3.id,
            assigneeId: qaTeam.id,
            reporterId: admin.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'UI Design Updated',
            description: 'Implement dark theme custom Tailwind configurations.',
            status: 'Completed',
            priority: 'High',
            dueDate: new Date('2026-07-31'),
            projectId: project1.id,
            assigneeId: designer.id,
            reporterId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Security Audit Scheduled',
            description: 'Audit npm package dependencies and secure dev env.',
            status: 'Completed',
            priority: 'Medium',
            dueDate: new Date('2026-08-01'),
            projectId: project3.id,
            assigneeId: security.id,
            reporterId: admin.id,
        },
    });
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map