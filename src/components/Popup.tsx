import ReactDOM from "react-dom";
import { usePopup } from "../context/PopupContext";

interface PopupProps {
  children: React.ReactNode;
}

const Popup = ({ children }: PopupProps) => {
  const { isPopupOpen, closePopup } = usePopup();

  if (!isPopupOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white overflow-hidden rounded-lg shadow-lg relative">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
