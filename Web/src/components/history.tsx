import React from "react";
import { Consumer } from "../context/Context";

const History: React.FC = () => {
    const { history } = Consumer();

    const list = history.sort((a, b) =>  b.item - a.item );

    return (
        <div className="history">
            <h1>Entradas a la residencial</h1>
            <table>
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map(({item, date, time, type, details }, index) => (
                            <tr style={{ background: (index + 1) % 2 === 0 ? "white" : "#EEEEEE" }} role="row" aria-label={`Event on ${date} at ${time}`}>
                                <td>{item}</td>
                                <td>{date}</td>
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