import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Tasks from "./Task/TaskList";
import Projects from "./Project/Projects";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Footer from "./Footer";
import ProjectDetail from "./Project/ProjectDetails";
import AdminPanel from "./admin/AdminPanel";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={4000} />
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

    );
};

export default App;
