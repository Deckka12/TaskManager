import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import AuthProvider from "./context/AuthContext";
import Tasks from './Task/TaskList';
import Projects from './Project/Projects';
import Login from "./Login/Login";
import ProjectDetail from './Project/ProjectDetails';
import Register from "./Login/Register";
import Footer from './Footer';
import AdminPanel from "./admin/AdminPanel";


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/project/:id" element={<ProjectDetail />} />
                        <Route path="*" element={<h2>Страница не найдена</h2>} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
