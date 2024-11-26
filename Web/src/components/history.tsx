import React from "react";
import { Consumer } from "../context/Context";
import Card from "./card";

const History: React.FC = () => {
    const { history } = Consumer();
    return (
        <div className="history">
            {
                history.sort().map(({ date, time, type, details }, index) => <Card key={index} date={date} time={time} type={type} details={details} />)
            }
        </div>
    );
}

export default History;