import { useState } from 'react';
import { Branch } from '../types';

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    buttonText?: string;
    children?: React.ReactNode;
}

const BranchModal = ({ isOpen, onClose, onSubmit, title, buttonText, children }: BranchModalProps) => {


    return (
        <dialog open={isOpen}>
            <article>
                <p>
                    {title}
                </p>
                {children}
                <footer>
                    <button onClick={onSubmit}>{buttonText}</button>
                    <button onClick={onClose} className="secondary">
                        Cancel
                    </button>
                </footer>
            </article>
        </dialog>
    )
}

export default BranchModal;