type Action = {
    type: "publish message";
    payload: { status: boolean, topic: string, details: string }
};

interface State {
    Status: boolean;
    Topic: string;
    Details: string;
}

export const InitialState = {
    Status: false,
    Topic: "",
    Details: ""
}

export const ContextReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "publish message": {
            const { status, topic, details } = action.payload;
            return {...state, Status: status, Topic: topic, Details: details };
        }
        default:
            return state;
    }
};

export default ContextReducer;
