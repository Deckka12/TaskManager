import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Tasks from './Task/TaskList';
import Projects from './Project/Projects';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <div className="content">
                <Routes>
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="*" element={<h2>Страница не найдена</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
