import React from 'react';

interface TimeModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    hoursSpent: number;
    setHoursSpent: (value: number) => void;
    workType: string;
    setWorkType: (value: string) => void;
    comment: string;
    setComment: (value: string) => void;
}

const AddTimeEntities: React.FC<TimeModalProps> = ({
    open,
    onClose,
    onSave,
    hoursSpent,
    setHoursSpent,
    workType,
    setWorkType,
    comment,
    setComment,
}) => {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>Списание трудозатрат</h3>
                <input
                    type="number"
                    placeholder="Часы"
                    min={0.1}
                    step={0.1}
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(parseFloat(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Тип работы"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                /> {/*TODO: Переделать под выпадающий список, предварительно будем поулчать из БД*/}
                <textarea
                    placeholder="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="buttons">
                    <button className="button primary" onClick={onSave}>Списать</button>
                    <button className="button secondary" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default AddTimeEntities;
