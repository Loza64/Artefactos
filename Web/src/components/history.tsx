import React from "react";
import { Consumer } from "../context/Context";

const History: React.FC = () => {
    const { history, getDayOfWeek, getLongDate } = Consumer();

    const list = history.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`);
        const dateTimeB = new Date(`${b.date} ${b.time}`);
        return dateTimeB.getTime() - dateTimeA.getTime();
    });

    return (
        <div className="history">
            <h1>Entradas a la residencial</h1>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map(({ date, time, type, details }, index) => (
                            <tr style={{ background: (index + 1) % 2 === 0 ? "white" : "#EEEEEE" }} role="row" aria-label={`Event on ${date} at ${time}`}>
                                <td>{`${getDayOfWeek(date)}, ${getLongDate(date)}`}</td>
                                <td>{time}</td>
                                <td>{type}</td>
                                <td>{details}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default History;