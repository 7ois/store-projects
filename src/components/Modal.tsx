import React from 'react';
import clsx from 'clsx';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean
    position?: 'center' | 'left' | 'right';
    classNameContainer?: string;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, position, classNameContainer }) => {
    return (
        <div className={clsx('absolute z-50', {
            'items-center justify-center': position === 'center',
            'left-0': position === 'left',
            'right-0': position === 'right',
        },
            isOpen ? 'block' : 'hidden',
            classNameContainer
        )}
        >
            {children}
        </div>
    );
};

export default Modal;
