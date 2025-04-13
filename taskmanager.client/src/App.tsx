import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Tasks from "./Task/TaskList";
import Projects from "./Project/Projects";
import Footer from "./Footer";
import ProjectDetail from "./Project/ProjectDetails";
import AdminPanel from "./admin/AdminPanel";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AuthProvider from "./context/AuthContext";

const App = () => {
    return (
        <AuthProvider> 
            <Router>
                <ToastContainer position="top-right" autoClose={4000} />
                <Header />
                <div className="content">
                    <Routes>
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
};

export default App;
