
import { createPortal } from "react-dom"
import "./Modal.css"
import {ButtonPrimary} from "../../Components"
import { useModalContext } from "./context/ModalContext";
import { useEffect, useRef } from "react";


interface ModalProps {
    children: React.ReactNode
}
export const Modal = ({children}:ModalProps)=>{

    const modalRef = useRef<HTMLDivElement>(null);
    const {state, setState} = useModalContext();
    const closeModal = () =>{setState(false)};
    const modalRoot = document.getElementById("modal");

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
    }

    useEffect(()=>{
        const handleEsc = (e: KeyboardEvent)=>{
            if(e.key == "Escape"){
                setState(false)
            }
        }
        if(state){
            document.addEventListener("keydown",handleEsc);
        }
        return()=>{
            document.removeEventListener("keydown",handleEsc);
        }
    },[setState,state])

    if(!state || !modalRoot){
        return null;
    }

    return(
        createPortal(
            <div className="modalBackdrop" onClick={closeModal}>
                <div className="modalContainer" onClick={handleContentClick} ref={modalRef}>
                    {children}
                    <div style={{alignSelf:"end"}}>
                        <ButtonPrimary label="Cerrar" customMethod={closeModal}/>
                    </div>
                </div>
            </div>,
            modalRoot
        )
    )
}