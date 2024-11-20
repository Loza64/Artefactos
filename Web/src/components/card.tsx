import React from "react";


const Card: React.FC<{ date: string, details: string }> = ({ date, details }) => {
    return (
        <div className="card">
            <label>{date}</label>
            <label>{details}</label>
        </div>
    )
}

export default Card;