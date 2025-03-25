import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css';
import API_BASE_URL from '../config';

interface TaskItem {
    id: string;
    title: string;
    description: string;
    status: number;
    priority: number;
    userName: string;
}

interface ProjectDetailsData {
    id: string;
    name: string;
    description: string;
    ownerId: string;
}

const getStatusText = (status: number) => ["�����", "� ��������", "���������"][status] || "����������";
const getPriorityText = (priority: number) => ["������", "�������", "�������"][priority] || "����������";

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [project, setProject] = useState<ProjectDetailsData | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${API_BASE_URL}/api/task/by-project/${id}`)
                .then(res => setTasks(res.data))
                .catch(err => console.error('������ �������� ����� �������:', err));

            axios.get(`${API_BASE_URL}/api/task/project/${id}`)
                .then(res => setProject(res.data))
                .catch(err => console.error('������ �������� �������:', err));
        }
    }, [id]);

    return (
        <div className="project-details-layout">
            <div className="project-tasks">
                <h2>������ �������</h2>
                {tasks.length === 0 ? <p>��� �����.</p> : (
                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <p><strong>������:</strong> {getStatusText(task.status)}</p>
                                <p><strong>���������:</strong> {getPriorityText(task.priority)}</p>
                                <p><strong>�����������:</strong> {task.userName}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="project-sidebar">
                <h3>� �������</h3>
                {project ? (
                    <>
                        <p><strong>��������:</strong> {project.name}</p>
                        <p><strong>��������:</strong> {project.description}</p>
                        <p><strong>��������:</strong> {project.ownerId}</p>
                    </>
                ) : <p>��������...</p>}
            </div>
        </div>
    );
};

export default ProjectDetails;
