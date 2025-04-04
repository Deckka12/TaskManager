import axios from 'axios';
import API_BASE_URL from '../../config';
import { TaskItem, FileItem, WorkLogInput } from './types';

export const fetchTaskDetails = (taskId: string, token: string) =>
    axios.get<TaskItem>(`${API_BASE_URL}/api/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const fetchFiles = (taskId: string, token: string) =>
    axios.get<FileItem[]>(`${API_BASE_URL}/api/task/files/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const uploadFile = (taskId: string, file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/api/task/files/upload/${taskId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteFile = (fileId: number, token: string) =>
    axios.delete(`${API_BASE_URL}/api/task/files/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const addWorkLog = (data: WorkLogInput, token: string) =>
    axios.post(`${API_BASE_URL}/api/task/worklog`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
