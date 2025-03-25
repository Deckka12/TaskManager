import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Projects.css'; // Подключаем CSS
import { AuthContext } from "../context/AuthContext";
import CreateProject from "./CreateProject";

interface ProjectUserRole {
    userId: string;
    userName: string;
    roleId: string;
    roleName: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    userName: string;
    userId: string;
    userRoles: ProjectUserRole[];
}

const API_BASE_URL = "http://localhost:5213";

const Projects: React.FC = () => {
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [createProject, getCreateProject] = useState<boolean>(false);

    useEffect(() => {
        // Загружаем проекты
        axios.get<Project[]>(`${API_BASE_URL}/api/project/project`)
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => console.error('Ошибка при загрузке проектов:', error));
    }, []);

    const openProjectCreate = () => getCreateProject(true);

    const openProjectDetails = (project: Project) => {
        setSelectedProject(project);
    };

    const closeProjectCreate = () => getCreateProject(false);

    const closeProjectDetails = () => {
        setSelectedProject(null);
    };

    return (
        <div className="project-container">
            {auth?.user && <button className="buttonstyle" onClick={openProjectCreate}>Создать</button>}
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
                            <p><strong>Описание:</strong> {selectedProject.description}</p>
                            <p><strong>Ответственный пользователь:</strong> {selectedProject.userName}</p>
                            <br></br>
                            {selectedProject.userRoles && selectedProject.userRoles.length > 0 && (
                                <div style={{ marginTop: '15px', textAlign: 'left' }}>
                                    <strong>Участники:</strong>
                                    <br></br>
                                    {Object.entries(
                                        selectedProject.userRoles.reduce((acc, curr) => {
                                            if (!acc[curr.roleName]) acc[curr.roleName] = [];
                                            acc[curr.roleName].push(curr.userName);
                                            return acc;
                                        }, {} as Record<string, string[]>)
                                    ).map(([roleName, users], index) => (
                                        <p key={index} style={{ margin: '6px 0' }}>
                                            <strong>{roleName}:</strong> {users.join(', ')}
                                        </p>
                                    ))}
                                </div>
                            )}
                            <div className="divbutton">
                                <button onClick={closeProjectDetails} className="buttonstyle">Закрыть</button>
                                {/*<button key={selectedTask.id} onClick={() => handleDeleteTask(selectedTask.id)} className="buttonstyle">Удалить</button>*/}
                            </div>
                        </div>
                    </div>
                )
            }

            {createProject && <CreateProject onClose={closeProjectCreate} />}
        </div>
    );
};

export default Projects;
