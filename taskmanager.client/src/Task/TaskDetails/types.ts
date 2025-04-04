export interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    status: number;
    priority: number;
    userName: string;
    workLogs: TimeEntry[];
}

export interface FileItem {
    id: number;
    fileName: string;
}

export interface TimeEntry {
    id: string;
    userId?: string;
    userName?: string;
    date: Date;
    hoursSpent: number;
    workType: string;
    comment?: string;
}

export interface WorkLogInput {
    taskId: string;
    userId: string;
    userName: string;
    hoursSpent: number;
    workType: string;
    comment: string;
}