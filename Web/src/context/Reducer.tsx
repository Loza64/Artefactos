/* eslint-disable react-refresh/only-export-components */

type Action = {
    type: "publish message";
    payload: { status: boolean, topic: string, details: string }
};

interface State {
    status: boolean;
    topic: string;
    details: string;
}

export const InitState = { status: false, topic: "", details: "" }

export const Reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "publish message": {
            const { status, topic, details } = action.payload;
            return { ...state, status,topic, details };
        }
        default:
            return state;
    }
};

export default Reducer;
