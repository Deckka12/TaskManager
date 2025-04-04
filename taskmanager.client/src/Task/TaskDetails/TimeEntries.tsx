import React from 'react';
import { TimeEntry } from './types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
    entries: TimeEntry[];
}

const TimeEntries: React.FC<Props> = ({ entries }) => (
    <ul className="worklog-list">
        {entries.map((entry) => (
            <li key={entry.id} className="worklog-item">
                <div className="worklog-meta">
                    <span className="meta-author">
                        Добавил(а) <strong>{entry.userName}</strong>{" "}
                        {entry.date ? `${formatDistanceToNow(new Date(entry.date), {
                            addSuffix: true,
                            locale: ru,
                        })}` : ""}
                    </span>
                </div>
                <div className="worklog-details">
                    <span className="worklog-time">• Трудозатраты: {entry.hoursSpent.toFixed(2)} ч</span>
                    <br />
                    <span className="worklog-time">• Тип работ: {entry.workType}</span>
                    {entry.comment && <p className="worklog-comment">Комментарий: {entry.comment}</p>}
                </div>
            </li>
        ))}
    </ul>
);

export default TimeEntries;