"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Popup from "../components/Popup";

type PopupContextProps = {
    showPopup: (content: ReactNode) => void;
    hidePopup: () => void;
};

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupContent, setPopupContent] = useState<ReactNode | null>(null);

    const showPopup = (content: ReactNode) => {
        setPopupContent(content);
        setIsOpen(true);
    };

    const hidePopup = () => {
        setIsOpen(false);
    };

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup }}>
            {children}
            <Popup isOpen={isOpen} onClose={hidePopup}>
                {popupContent}
            </Popup>
        </PopupContext.Provider>
    );
};
