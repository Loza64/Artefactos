/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState, useRef, useContext } from "react";
import mqtt from "mqtt";

const { VITE_IP, VITE_USER, VITE_PASS } = import.meta.env;

const url = `ws://${VITE_IP}:9001`;
const options = { username: VITE_USER, password: VITE_PASS };

//Interface body
interface BodyMessage {
    [topic: string]: string;
}

interface HistoryResident {
    date: string
    details: string
}

interface ResidentsList {
    house: number
    target: string
    name: string
}

interface ContextValues {
    residentList: ResidentsList[]
    history: HistoryResident[]
    message: BodyMessage
    PublishMessage: (topic: string, message: string) => void;
}

//Context
export const Context = createContext<ContextValues | undefined>(undefined);

export default function Provider({ children }: { children: ReactNode }) {

    const [message, setMessage] = useState<BodyMessage>({});

    const [history, setHistory] = useState<HistoryResident[]>([
        { date: '2023-01-01', details: 'Alice moved into house 101' },
        { date: '2023-02-10', details: 'Bob moved into house 102' },
        { date: '2023-03-20', details: 'Charlie moved into house 103' },
        { date: '2023-03-20', details: 'Emergency to resident' },
        { date: '2023-03-20', details: 'Emergency to invited' }
    ])

    const [residentList, setResidentList] = useState<ResidentsList[]>([
        { house: 101, target: 'Kitchen', name: 'Alice' },
        { house: 102, target: 'Living Room', name: 'Bob' },
        { house: 103, target: 'Bedroom', name: 'Charlie' },
    ]);

    const client = useRef(mqtt.connect(url, options));
    const socket = client.current

    const topics: string[] = [
        "/resident/target"
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
        <Context.Provider value={{ PublishMessage, message, history, residentList }}>
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