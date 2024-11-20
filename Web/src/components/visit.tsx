import style from 'styled-components'
import React from "react";
import { Consumer } from "../context/Context";

interface VisitProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Visit: React.FC<VisitProps> = ({ open, setOpen }) => {
    const { topics, targeta } = Consumer();
    return (
        <FormContainer>
            <form>
                <input type="text" placeholder="targeta" disabled value={targeta[topics[1]]} />
                <input type="text" placeholder="nombre" disabled />
                <input type="number" placeholder="numero de caa a visitar" disabled />
                <button>Autorizar visita</button>
            </form>
        </FormContainer>
    )
}

const FormContainer = style.div`
position:fixed;
with:100%;
height:100vh;
`

export default Visit;