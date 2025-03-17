import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Projects.css'; // Подключаем CSS

interface Project {
    id: string;
    name: string;
    description: string;
    userName: string;
    userId: string;
}

const API_BASE_URL = "http://localhost:5213";

const Projects: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);


    useEffect(() => {
        // Загружаем проекты
        axios.get<Project[]>(`${API_BASE_URL}/api/task/project`)
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => console.error('Ошибка при загрузке проектов:', error));
    }, []);

    // Функция для открытия модального окна с детальным описанием
    const openProjectDetails = (project: Project) => {
        setSelectedProject(project);
    };

    // Функция для закрытия модального окна
    const closeProjectDetails = () => {
        setSelectedProject(null);
    };
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
                                    <div className="images"><img onClick={() => openProjectDetails(project)} src="./src/Icons/view.png" /></div>
                                    <div className="images"><img src="./src/Icons/Edit.png" /></div>
                                     <div className="images"><img /*onClick={() => handleDeleteTask(task.id)}*/ src="./src/Icons/Delete.png" /></div>
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}

            {
                selectedProject && (
                    <div className="modal-overlay" onClick={closeProjectDetails}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{selectedProject.name}</h2>
                            <p ><strong>Описание:</strong> {selectedProject.description}</p>
                            <p><strong>Ответственный пользователь:</strong> {selectedProject.userName}</p>
                            {/*{selectedTask.workLogs && selectedTask.workLogs.length > 0 && (*/}
                            {/*    <>*/}
                            {/*        <h3>Логи работы:</h3>*/}
                            {/*        <ul>*/}
                            {/*            {selectedTask.workLogs.map((log, index) => (*/}
                            {/*                <li key={index}>{JSON.stringify(log)}</li>*/}
                            {/*            ))}*/}
                            {/*        </ul>*/}
                            {/*    </>*/}
                            {/*)}*/}
                            <div className="divbutton">
                                <button onClick={closeProjectDetails} className="buttonstyle">Закрыть</button>
                                {/*<button key={selectedTask.id} onClick={() => handleDeleteTask(selectedTask.id)} className="buttonstyle">Удалить</button>*/}
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default Projects;
