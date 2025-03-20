import axios from "axios";
import API_BASE_URL from "../config";

interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    status: number;
    priority: number;
    userName: string;
    userId: string;
    categoryID: string;
    dueDate?: Date;
}

export const updateTask = async (taskId: string, updates: Partial<TaskItem>) => {
    return axios.patch(`${API_BASE_URL}/api/task/${taskId}`, updates, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};
