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
export interface WorkType {
    id: string;
    name: string;
}

export interface TimeEntry {
    id: string;
    userId?: string;
    userName?: string;
    date: string;
    hoursSpent: number;
    workType: WorkType; // <-- גלוסעמ string
    comment?: string;
}

export interface WorkLogInput {
    taskId: string;
    userId: string;
    userName: string;
    hoursSpent: number;
    workTypeId: string;
    comment: string;
}

export interface CommentDto {
    id: string;
    taskId: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
}
