import React from "react";
import { Consumer } from "../context/Context";

const Residents: React.FC = () => {
    const { PublishMessage } = Consumer();
    return (
        <>
            <button onClick={() => { PublishMessage("/residencia/web/data/motor", "open") }}>Move servo</button>
        </>
    )
}

export default Residents;