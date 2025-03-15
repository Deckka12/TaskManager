import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Projects.css'; // Подключаем CSS

interface Project {
    id: string;
    name: string;
    description: string;
}

const API_BASE_URL = "http://localhost:5213";

const Projects: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);


    useEffect(() => {      
        // Загружаем проекты
        axios.get<Project[]>(`${API_BASE_URL}/api/task/project`)
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => console.error('Ошибка при загрузке проектов:', error));
    }, []);
    return (
        <div className="project-container">
            <h2>Список проектов</h2>
            {loading ? <p className="loading-text">Загрузка задач...</p> : (
                setProjects.length === 0 ? (
                    <p className="no-project">Нет задач.</p>
                ) : (
                    <>
                            <div className="project-list">
                                {projects.map(project => (
                                    <div key={project.id} className="project-card">
                                        <h3>{project.name}</h3>
                                        <h5>{project.description}</h5>
                                </div>
                            ))}
                        </div>

                       
                    </>
                )
            )}
        </div>
    );
}

export default Projects;
