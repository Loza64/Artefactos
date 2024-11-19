import React from "react";
import { Consumer } from "../context/Context";

const Residents: React.FC = () => {
    const { PublishMessage, topics } = Consumer();
    return (
        <>
            <button onClick={() => { PublishMessage(topics[1], "visit") }}>Move servo</button>
        </>
    )
}

export default Residents;