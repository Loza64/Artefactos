/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState, useRef, useContext } from "react";
import mqtt from "mqtt";

const { VITE_IP, VITE_USER, VITE_PASS } = import.meta.env;

const url = `ws://${VITE_IP}:9001`;
const options = { username: VITE_USER, password: VITE_PASS };

interface BodyMessage {
    [topic: string]: string;
}

interface ContextValues {
    message: BodyMessage
    PublishMessage: (topic: string, message: string) => void;
}

export const Context = createContext<ContextValues | undefined>(undefined);

export default function Provider({ children }: { children: ReactNode }) {

    const [message, setMessage] = useState<BodyMessage>({});

    const client = useRef(mqtt.connect(url, options));
    const socket = client.current
    const topics: string[] = [
        "/residencia/people/id/data"
    ]

    useEffect(() => {
        socket.on("connect", () => {
            if (topics.length > 0) {
                socket.subscribe(topics, (err) => {
                    if (err) {
                        console.error("Subscribed to topics error: ", err);
                    } else {
                        console.log("Subscribed to topics successfully.");
                    }
                });
            }
        });

        socket.on("message", (topic, message) => {
            setMessage({ [topic]: message.toString() });
            console.log({ [topic]: message.toString() });
        });

        socket.on("error", (err) => {
            console.error("MQTT connection error:", err);
        });

        socket.on("close", () => {
            console.log("MQTT connection closed.");
        });

        return () => {
            socket.end();
        };
    }, []);

    const PublishMessage = (topic: string, message: string) => {
        if (socket.connected) {
            socket.publish(topic, message, (err) => {
                if (err) {
                    //Error message
                } else {
                    //Success message
                }
            });
        } else {
            alert("mqtt is not connected");
        }
    };

    return (
        <Context.Provider value={{ PublishMessage, message }}>
            {children}
        </Context.Provider>
    );
}

export const Consumer = () => {
    const contextValue = useContext(Context);
    if (!contextValue) {
        throw new Error("useContextValue must be used within a Provider");
    }
    return contextValue;
};