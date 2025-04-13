import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchTaskDetails, fetchFiles, uploadFile, deleteFile, addWorkLog } from './api';
import { TaskItem, FileItem } from './types';
import FileList from './FileList';
import TimeEntries from './TimeEntries';
import TaskInfo from './TaskInfo';
import CommentsStub from './CommentsStub';
import AddTimeEntities from './AddTimeEntities';
import CloseIcon from '../../Icons/Delete.png';


import './TaskDetails.css';

interface TaskDetailsProps {
    taskId: string;
    onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
    const auth = useContext(AuthContext);
    const [task, setTask] = useState<TaskItem | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [hoursSpent, setHoursSpent] = useState(0);

    const [workTypeId, setWorkTypeId] = useState<string>("");

    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState<'info' | 'files' | 'worklog' | 'comments'>('info');

    useEffect(() => {
        if (!auth?.token) return;
        fetchTaskDetails(taskId, auth.token).then(res => setTask(res.data));
        fetchFiles(taskId, auth.token).then(res => setFiles(res.data));
    }, [taskId, auth]);

    const handleFileUpload = async (file: File) => {
        if (!auth?.token) return;
        await uploadFile(taskId, file, auth.token);
        const res = await fetchFiles(taskId, auth.token);
        setFiles(res.data);
    };

    const handleFileDelete = async (fileId: number) => {
        if (!auth?.token) return;
        await deleteFile(fileId, auth.token);
        const res = await fetchFiles(taskId, auth.token);
        setFiles(res.data);
    };

    const handleAddWorkLog = async () => {
        if (!auth?.token || !task || !auth.user?.id || !auth.user?.name) return;

        try {
            const requestBody = {
                taskId,
                userId: auth.user.id,
                userName: auth.user.name,
                hoursSpent,
                workTypeId,
                comment,
            };
            console.log("Отправка worklog", requestBody);
            await addWorkLog(requestBody, auth.token); // тут тип any подходит
            const res = await fetchTaskDetails(taskId, auth.token);
            setTask(res.data);

            setModalOpen(false);
            setHoursSpent(0);
            setComment('');
        } catch (error) {
            console.error('Ошибка при списании времени:', error);
        }
    };



    if (!task) return <div>Загрузка...</div>;

    return (
        <>
            <div className="modal-overlay">
                
                <div className="task-details" onClick={e => e.stopPropagation()}>
                    <div className="imagesDetails">
                        <img className="images" onClick={onClose} src={CloseIcon} />
                    </div>
                    <div className="tabs">
                        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Информация</button>
                        <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>Файлы</button>
                        <button className={activeTab === 'worklog' ? 'active' : ''} onClick={() => setActiveTab('worklog')}>Трудозатраты</button>
                        <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => setActiveTab('comments')}>Комментарии</button>
                    </div>
                   
                    {activeTab === 'info' && <TaskInfo task={task} />}

                    {activeTab === 'files' && (
                        <>
                            <h3>Файлы</h3>
                            <FileList files={files} onUpload={handleFileUpload} onDelete={handleFileDelete} />
                        </>
                    )}

                    {activeTab === 'worklog' && (
                        <>
                            <h3>Трудозатраты</h3>
                            <button className="buttonstyle" onClick={() => setModalOpen(true)}>Добавить</button>
                            <TimeEntries entries={task.workLogs} />
                        </>
                    )}

                    {activeTab === 'comments' && (
                        <>
                            <h3>Комментарии</h3>
                            <CommentsStub taskId={task.id} />
                        </>
                    )}
                </div>
            </div>

            <AddTimeEntities
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddWorkLog}
                hoursSpent={hoursSpent}
                setHoursSpent={setHoursSpent}
                workTypeId={workTypeId}
                setWorkTypeId={setWorkTypeId}
                comment={comment}
                setComment={setComment}
            />

        </>
    );
};

export default TaskDetails;
