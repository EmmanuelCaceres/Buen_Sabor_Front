import { useState } from "react";

export default function useModal(initialValue: boolean = false): [boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState(initialValue);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return [isOpen, openModal, closeModal];
}
