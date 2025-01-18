"use client";
import { ReactNode } from "react";
import ReactDOM from "react-dom";

type PopupProps = {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
};

export default function Popup({ isOpen, onClose, children }: PopupProps) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center bg-[#000]">
            <div className="bg-[#fff] pt-6 rounded-lg shadow-lg relative w-auto h-auto">
                {/* <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✖
                </button> */}
                {children}
                <div className='flex items-center justify-center gap-10 h-auto py-6 shadow-md'>
                    <button
                        type="button"
                        className='border w-[300px] h-[50px] rounded-[10px] border-primary text-primary'
                        onClick={onClose}>
                        Cancel
                    </button>
                    <button className='border w-[300px] h-[50px] rounded-[10px] bg-blue text-[#fff]'>Submit</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
