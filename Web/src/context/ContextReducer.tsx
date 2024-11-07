/* eslint-disable react-refresh/only-export-components */

type Action =
    | { type: "Save Subscribes"; payload: Array<string> }
    | { type: "Get Data Subscribes"; payload: null };

interface State {
    Topic: string;
    Status: boolean;
    Data: string;
}

export const InitialState: State = {
    Topic: "",
    Status: false,
    Data: ""
}


export const ContextReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "Save Subscribes": {
            return { ...state, Status: true, Data: "Suscripciones guardadas" };
        }
        case "Get Data Subscribes": {
            return state;
        }
        default:
            return state;
    }
};

export default ContextReducer;