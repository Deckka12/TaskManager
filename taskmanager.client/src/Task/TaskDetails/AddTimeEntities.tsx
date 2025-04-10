import React, { useEffect, useState } from 'react';
import { fetchWorkTypes } from '../../Task/TaskDetails/api';
import { WorkType } from '../../Task/TaskDetails/types';
import './TaskDetails.css'; 

interface TimeModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    hoursSpent: number;
    setHoursSpent: (value: number) => void;
    workTypeId: string;
    setWorkTypeId: (value: string) => void;
    comment: string;
    setComment: (value: string) => void;
}

const AddTimeEntities: React.FC<TimeModalProps> = ({
    open,
    onClose,
    onSave,
    hoursSpent,
    setHoursSpent,
    workTypeId,
    setWorkTypeId,
    comment,
    setComment,
}) => {
    const [workTypes, setWorkTypes] = useState<WorkType[]>([]);

    useEffect(() => {
        if (open) {
            fetchWorkTypes()
                .then(setWorkTypes)
                .catch(err => console.error("Ошибка загрузки типов работ", err));
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Списание трудозатрат</h3>

                <label className="modal-label">Часы</label>
                <input
                    className="modal-input"
                    type="number"
                    placeholder="0.5"
                    min={0.1}
                    step={0.1}
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(parseFloat(e.target.value))}
                />

                <label className="modal-label">Тип работы</label>
                <select
                    className="modal-select"
                    value={workTypeId}
                    onChange={(e) => setWorkTypeId(e.target.value)}
                >
                    <option value="">Выберите тип работы</option>
                    {workTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                <label className="modal-label">Комментарий</label>
                <textarea
                    className="modal-textarea"
                    placeholder="Что делали?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="modal-buttons">
                    <button className="button primary" onClick={onSave}>Списать</button>
                    <button className="button secondary" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default AddTimeEntities;
