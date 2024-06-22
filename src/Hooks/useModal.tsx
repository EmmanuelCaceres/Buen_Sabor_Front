import { useState } from "react";

export default function useModal(initialValue:boolean =false): [boolean, () => void, () => void]{
    const [isOpen,setIsOpen] = useState(initialValue);
    const openModal:boolean | (()=> void) = () =>setIsOpen(true);
    const closeModal:boolean | (()=> void) = () =>setIsOpen(false);

    return [isOpen,openModal,closeModal];
}