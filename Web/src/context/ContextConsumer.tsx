import React, { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import ContextReducer, { InitialState } from "./ContextReducer";
import mqtt from "mqtt";

// Configuración MQTT
const url = "ws://192.168.117.37:9001";
const options = { username: "loza", password: "loza" };
const client = mqtt.connect(url, options);

// Definición de los tipos de mensajes y contexto
interface BodyMessage {
    topic: string;
    data: string;
}

interface ContextValues {
    setTopics: (topics: string[]) => void;
    Status: boolean;
    Topic: string;
    Details: string;
    message: BodyMessage;
    PublishMessage: (topic: string, message: string) => void;
}

const ContextProvider = createContext<ContextValues | undefined>(undefined);

export const ContextConsumer: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [topics, setTopics] = useState<string[]>([]);
    const [state, dispatch] = useReducer(ContextReducer, InitialState);
    const [message, setMessage] = useState<BodyMessage>({ topic: "", data: "" });

    useEffect(() => {
        client.on("connect", () => {
            console.log("Mqtt Socket connection success.");
            if (topics.length > 0) {
                client.subscribe(topics, (err) => {
                    if (!err) {
                        console.log("Mqtt subscribed to topics successfully.");
                    } else {
                        console.log("Failed to subscribe to topics.");
                    }
                });
            }
        });

        client.on("message", (topic, message) => {
            setMessage({ topic, data: message.toString() });
        });

        client.on("error", (err) => {
            console.error("MQTT connection error:", err);
        });

        return () => {
            client.end();
        };
    }, [topics]);

    const PublishMessage = (topic: string, message: string) => {
        client.publish(topic, message, (err) => {
            if (err) {
                dispatch({
                    type: "publish message", payload: {
                        status: false,
                        topic: topic,
                        details: `Error to publish message: ${err.message}`
                    }
                });
            } else {
                dispatch({
                    type: "publish message", payload: {
                        status: true,
                        topic: topic,
                        details: `Message publish success.`
                    }
                });
            }
        });
    }
    const { Topic, Status, Details } = state;

    return (
        <ContextProvider.Provider value={{ setTopics, Topic, Status, Details, message, PublishMessage }}>
            {children}
        </ContextProvider.Provider>
    );
};

