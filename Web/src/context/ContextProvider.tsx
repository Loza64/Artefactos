/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useReducer, useState, useRef, useContext } from "react";
import Reducer, { InitState } from "./Reducer";
import mqtt from "mqtt";

const { VITE_IP, VITE_USER, VITE_PASS } = import.meta.env;

const url = `ws://${VITE_IP}:9001`;
const options = { username: VITE_USER, password: VITE_PASS };

interface BodyMessage {
    [topic: string]: string;
}

interface ContextValues {
    status: boolean
    topic: string;
    details: string;
    message: BodyMessage
    PublishMessage: (topic: string, message: string) => void;
}

export const Context = createContext<ContextValues | undefined>(undefined);

export default function ContextProvider({ children }: { children: ReactNode }) {

    const [state, dispatch] = useReducer(Reducer, InitState);
    const [message, setMessage] = useState<BodyMessage>({});

    const client = useRef(mqtt.connect(url, options));
    const socket = client.current
    const topics: string[] = []

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
                    dispatch({
                        type: "publish message", payload: {
                            status: true,
                            topic: topic,
                            details: err.message
                        }
                    });
                } else {
                    dispatch({
                        type: "publish message", payload: {
                            status: true,
                            topic: topic,
                            details: `Publish message success.`
                        }
                    });
                }
            });
        } else {
            alert("mqtt is not connected");
        }
    };

    const { topic, status, details } = state;

    return (
        <Context.Provider value={{ topic, status, details, PublishMessage, message }}>
            {children}
        </Context.Provider>
    );
}

export const ContextConsumer = () => {
    const contextValue = useContext(Context);
    if (!contextValue) {
        throw new Error("useContextValue must be used within a ContextProvider");
    }
    return contextValue;
};