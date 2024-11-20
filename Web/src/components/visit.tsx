import style from 'styled-components'
import React from "react";
import { Consumer } from "../context/Context";

interface VisitProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Visit: React.FC<VisitProps> = ({ open, setOpen }) => {
  const { PublishMessage, topics } = Consumer();

  const SubMitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    PublishMessage(topics[1], "visit");
  }

  return (
    <Modal open={open}>
      <div className='modal-container'>
        <div className='modal-head'>
          <button onClick={() => { setOpen(false) }}>
            X
          </button>
          <div>
            <h2>Registrar visitante</h2>
          </div>
        </div>
        <form className='modal-body' onSubmit={(e) => { SubMitForm(e) }}>
          <input type="text" placeholder="dui" />
          <input type="text" placeholder="nombre" />
          <input type="number" placeholder="numero de casa a visitar" />
          <button>Autorizar visita</button>
        </form>
      </div>
    </Modal>
  )
}

const Modal = style.div<{ open: boolean }>`
position: fixed;
width: 100%;
height: 100vh;
z-index: ${({ open }) => (open ? "3" : "-1")};
display: flex;
justify-content: center;
align-items: center;
background: ${({ open }) => (open ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)")};
transition: all 0.3s ease-in-out;

.modal-container{
 width:100%;
 display:flex;
 flex-direction:column;
 align-items:center;
 background:white;
 max-width:500px;
 transition: all 0.3s ease-in-out;
 border-radius:15px;
 overflow:hidden;
 transform:scale(${({ open }) => (open ? "1" : "0")})
}

.modal-head{
 width:100%;
 background:rgb(0, 0, 63);
 display:flex;
 flex-direction:column;
 align-items:end;
 padding:10px 10px;

   button{
    background:rgb(0, 0, 190);
    border:none;
    padding:4px 7px;
    border-radius:100%;
    color:white;
    font-weight:900;
    transition: all 0.5s ease-in-out;
   }
   div{
    width:100%;
    display:flex;
    align-item:center;
    justify-content:center;
    margin-top:20px;
    margin-bottom:42px;
    
      h2{
      color:white;
      font-size:40px;
      font-weight:800;
      }
   }
}

.modal-body{
 width:100%;
 display:flex;
 flex-direction:column;
 align-items:center;
 padding:0 30px;

    input{
     width:100%;
     border:none;
     text-align:center;
     border-bottom:solid 3px blue;
     background:white;
     font-size:20px;
     font-weight:800;
     margin:20px 20px;
     padding: 10px 0;
     outline:none;
     transition: all 0.5s ease-in-out;     
    }

    button {  
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(2,0,255,1) 100%);  
    border: none;  
    color: white;  
    margin-top: 10px;  
    margin-bottom: 32px;  
    font-size: 20px;  
    font-weight: 700;  
    padding: 10px 20px;  
    width: 100%;  
    border-radius: 5px;  
    transition: all 0.1s ease-in-out;
    }  

    button:hover {  
    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,128,1) 100%); 
    }  

    button:active {  
    transform:scale(0.99);
    }
}
`

export default Visit;