import App from "../App";
import AuthProvider from "./AuthContext";
import { useNotifications } from "../hooks/useNotifications";

const AppWithNotifications = () => {
    useNotifications(); // ���������� ��� ������ ����������
    return <App />;
};

const Main = () => {
    return (
        <AuthProvider>
            <AppWithNotifications />
        </AuthProvider>
    );
};

export default Main;
