import React, { useState } from 'react';
import { TimeEntry } from './types';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (entry: TimeEntry) => void;
}

const TimeModal: React.FC<Props> = ({ open, onClose, onSave }) => {
    const [entry, setEntry] = useState<Omit<TimeEntry, 'id'>>({
        date: new Date(),
        hoursSpent: 0,
        workType: '',
        comment: ''
    });

    const handleSave = () => {
        const newEntry = { ...entry, id: crypto.randomUUID() };
        onSave(newEntry);
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal">
                <h3>Добавить трудозатраты</h3>
                <input
                    type="number"
                    value={entry.hoursSpent}
                    onChange={e => setEntry({ ...entry, hoursSpent: parseFloat(e.target.value) })}
                    placeholder="Часы"
                />
                <input
                    type="text"
                    value={entry.workType}
                    onChange={e => setEntry({ ...entry, workType: e.target.value })}
                    placeholder="Тип работ"
                />
                <textarea
                    value={entry.comment}
                    onChange={e => setEntry({ ...entry, comment: e.target.value })}
                    placeholder="Комментарий"
                />
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </>
    );

};

export default TimeModal;
