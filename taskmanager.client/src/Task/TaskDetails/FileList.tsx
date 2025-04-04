import React, { useRef } from 'react';
import { FileItem } from './types';
import CloseIcon from '../../Icons/Delete.png';
import API_BASE_URL from '../../config';
import './TaskDetails.css';

interface Props {
    files: FileItem[];
    onUpload: (file: File) => void;
    onDelete: (id: number) => void;
}

const FileList: React.FC<Props> = ({ files, onUpload, onDelete }) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleFileChange = () => {
        if (fileInput.current?.files?.[0]) {
            onUpload(fileInput.current.files[0]);
        }
    };

    return (
        <div className="file-list">
            <input type="file" ref={fileInput} onChange={handleFileChange} />
            <ul className="file-items">
                {files.map(file => (
                    <li key={file.id} className="file-item">
                        <a
                            href={`${API_BASE_URL}/api/task/files/download/${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                        >
                            {file.fileName}
                        </a>
                        <button className="delete-button" onClick={() => onDelete(file.id)}>
                            <img src={CloseIcon} alt="Удалить" className="delete-icon" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;