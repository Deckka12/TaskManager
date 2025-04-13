import React from 'react';
import { TaskItem } from './types';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    task: TaskItem;
}

const getStatusText = (status: number) => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
const getPriorityText = (priority: number) => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

const TaskInfo: React.FC<Props> = ({ task }) => (
    <div className="task-info">
        <h2>{task.title}</h2>

        <div className="task-description">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    p({ children }) {
                        return <p style={{ margin: "0 0 0.5rem 0", lineHeight: 1.5 }}>{children}</p>;
                    }
                }}
            >
                {task.description.replace(/\n/g, '  \n')}
            </ReactMarkdown>
        </div>

        <p><strong>Проект:</strong> {task.projectName}</p>
        <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
        <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
        <p><strong>Ответственный:</strong> {task.userName}</p>
    </div>
);

export default TaskInfo;
