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
    isConnected: boolean;
    Topic: string;
    Details: string;
    message: BodyMessage;
    PublishMessage: (topic: string, message: string) => void;
}

export const Context = createContext<ContextValues | undefined>(undefined);

export default function ContextProvider({ children }: { children: ReactNode }) {

    // Hooks  
    const [isConnected, setIsConnected] = useState(false);
    const [state, dispatch] = useReducer(Reducer, InitState);
    const [message, setMessage] = useState<BodyMessage>({});

    // Socket  
    const client = useRef(mqtt.connect(url, options));
    const topics: string[] = [
        "/test/int",
        "/test/float",
        "/test/comment"
    ];

    useEffect(() => {
        const mqttClient = client.current;

        mqttClient.on("connect", () => {
            console.log("MQTT Socket connection success.");
            setIsConnected(true);
            if (topics.length > 0) {
                mqttClient.subscribe(topics, (err) => {
                    if (err) {
                        console.log("Failed to subscribe to topics: ", err);
                    } else {
                        console.log("Subscribed to topics successfully.");
                    }
                });
            }
        });

        mqttClient.on("message", (topic, message) => {
            setMessage({ [topic]: message.toString() });
            console.log({ [topic]: message.toString() });
        });

        mqttClient.on("error", (err) => {
            console.error("MQTT connection error:", err);
        });

        mqttClient.on("close", () => {
            console.log("MQTT connection closed.");
            setIsConnected(false);
        });

        return () => {
            mqttClient.end();
        };
    }, []);

    const PublishMessage = (topic: string, message: string) => {
        client.current.publish(topic, message, (err) => {
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
    };

    const { Topic, Status, Details } = state;

    const contextValue = {
        Topic,
        Status,
        Details,
        message,
        PublishMessage,
        isConnected
    };

    return (
        <Context.Provider value={contextValue}>
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