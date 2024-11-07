import React, { createContext, ReactNode, useReducer } from "react";
import ContextReducer, { InitialState } from "./ContextReducer";

interface ContextValues {
    saveSubscribes: (topic: Array<string>) => void;
    Status: boolean;
    Topic: string;
    Data: string;
}

const ContextProvider = createContext<ContextValues | undefined>(undefined); // Exportar para uso en otros componentes  

export const ContextConsumer: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(ContextReducer, InitialState);

    const saveSubscribes = (topic: Array<string>): void => {
        dispatch({ type: "Save Subscribes", payload: topic });
    };

    const { Topic, Status, Data } = state;
    
    return (
        <ContextProvider.Provider value={{ saveSubscribes, Topic, Status, Data }}>
            {children}
        </ContextProvider.Provider>
    );
};

