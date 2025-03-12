import React from 'react';
import './App.css';
import TaskList from './Task/TaskList';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <TaskList />
        </div>
    );
}

export default App;
