import { useEffect, useContext } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import { toast } from "react-toastify";

export const useNotifications = () => {
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.user?.id) {
            console.warn("❌ Нет user.id для подключения к SignalR");
            return;
        }

        const connection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/hubs/notifications?userId=${auth.user.id}`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        connection.on("ReceiveNotification", (message: string) => {
            toast.info(`🔔 ${message}`);
        });

        connection
            .start()
            .then(() => console.log("✅ Connected to notification hub"))
            .catch((err) => console.error("❌ Connection error:", err));

        return () => {
            connection.stop();
        };
    }, [auth?.user?.id]);
};
