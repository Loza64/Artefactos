import React from "react";


const Card: React.FC<{ date: string, time: string, type: string, details: string }> = ({ date, time, type, details }) => {
    return (
        <div className="card">
            <label>{`Fecha: ${date}, Hora: ${time}`}</label>
            <label>{`Type: ${type}`}</label>
            <label>{details}</label>
        </div>
    )
}

export default Card;