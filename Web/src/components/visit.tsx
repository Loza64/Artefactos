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
        <FormContainer open={open}>
            <form>
                <div onClick={() => { setOpen(false) }}><label>X</label></div>
                <input type="text" placeholder="targeta" disabled value={targeta[topics[1]]} />
                <input type="text" placeholder="nombre" />
                <input type="number" placeholder="numero de casa a visitar" />
                <button>Autorizar visita</button>
            </form>
        </FormContainer>
    )
}

const FormContainer = style.div<{open:boolean}>`
position: fixed;
width: 100%;
height: 100vh;
z-index: ${({ open }) => (open ? "3" : "-1")};
display: flex;
justify-content: center;
align-items: center;
background: ${({ open }) => (open ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)")};
transition: all 0.5s ease-in-out;

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
  background-color: white;
  padding: 35px 15px;
  transition: all 0.5s ease-in-out;
  transform:scale(${({ open }) => (open ? "130%" : "0%")});
}

div {
  width:100%;
  display:flex;
  justify-content:flex-end;
}

div label{
background:blue;
color:white;
padding:2px 5.5px;
border-radius:30px;
}

input {
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  background: #f0f0f0;
  margin: 15px 0;
  padding: 10px 0;
  text-align: center;
  font-weight: 800;
  width: 100%;
}

button {
  border: none;
  background: blue;
  padding: 10px 0;
  font-weight: 700;
  color: white;
  margin: 10px 20px;
  cursor: pointer;
  border-radius:10px;

}

button:hover {
  background: darkblue;
}

button:focus {
  outline: 2px solid lightblue;
}

`

export default Visit;