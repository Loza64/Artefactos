/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState, useRef, useContext } from "react";
import mqtt from "mqtt";
import { toast } from "react-toastify";

const { VITE_IP, VITE_USER, VITE_PASS } = import.meta.env;

const url = `ws://${VITE_IP}:9001`;
const options = { username: VITE_USER, password: VITE_PASS };

interface History {
    date: string
    type: string
    details: string
}

interface ResidentsList {
    house: number
    target: string
    name: string
}

interface ContextValues {
    residentList: ResidentsList[]
    history: History[]
    topics: string[]
    PublishMessage: (topic: string, message: string) => void
}

//Context
export const Context = createContext<ContextValues | undefined>(undefined);

export default function Provider({ children }: { children: ReactNode }) {

    const [history, setHistory] = useState<History[]>([]);

    const residentList: ResidentsList[] = [
        { house: 101, target: '-f3-6c 00-28', name: 'Alice' },
        { house: 102, target: '-63-37 0c-1a', name: 'Bob' },
        { house: 103, target: '-43-9e-a2-13', name: 'Charlie' },
    ]

    const client = useRef(mqtt.connect(url, options));
    const socket = client.current

    const subscriptions: string[] = [
        "/resident/target",
        "/residencial/visit"
    ]
    const topics: string[] = [
        "/residencial/door/",
        "/residencial/emergency"
    ]

    useEffect(() => {
        socket.on("connect", () => {
            if (subscriptions.length > 0) {
                socket.subscribe(subscriptions, (err) => {
                    if (err) {
                        console.error("Subscribed to topics error: ", err);
                    } else {
                        console.log("Subscribed .");
                    }
                });
            }
        });

        socket.on("message", (topic, message) => {
            switch (topic) {
                case subscriptions[0]: {
                    const check = residentList.find((item) => item.target === message.toString());
                    if (check) {
                        toast.success(`${check.name} reside house: ${check.house}`, { position: 'bottom-right' });
                        setTimeout(() => { PublishMessage(topics[0], "open") }, 1000);
                        setHistory(prevHistory => [
                            ...prevHistory,
                            { date: (new Date()).toLocaleString(), type: "normal", details: `${check.name} reside house: ${check.house}` }
                        ]);
                    } else {
                        toast.error("Resident not found ", { position: 'bottom-right' });
                    }
                    break;
                }
            }
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
                    alert(err)
                } else {
                    if (topic === topics[1]) {
                        setHistory(prevHistory => [
                            ...prevHistory,
                            { date: (new Date()).toLocaleString(), type: "emergency", details: `Emergency to ${message}` }
                        ]);
                    }
                }
            });
        } else {
            alert("mqtt is not connected");
        }
    };

    return (
        <Context.Provider value={{ PublishMessage, history, residentList, topics}}>
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