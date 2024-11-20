import React, { useState } from "react";
import { Consumer } from "../context/Context";
import Visit from "./visit";

const Menu: React.FC = () => {
    const { PublishMessage, topics } = Consumer();
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <div className="menu">
                <label className="logo">Residencial godines</label>
                <div className="options">
                    <button>Visitante</button>
                    <button onClick={() => { PublishMessage(topics[1], "resident") }}>Emergencia residente</button>
                    <button onClick={() => { PublishMessage(topics[1], "visit") }}>Emergencia visitante</button>
                </div>
            </div>
            <Visit  open={open} setOpen={setOpen}></Visit>
        </>

    )
}

export default Menu;