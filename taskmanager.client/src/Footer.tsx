import React from "react";
import "./Footer.css"; // Подключаем стили

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">© {new Date().getFullYear()} Task Manager. Все права защищены.</p>

            </div>
        </footer>
    );
};

export default Footer;
