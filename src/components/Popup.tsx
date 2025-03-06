import ReactDOM from "react-dom";
import { usePopup } from "../context/PopupContext";
import clsx from "clsx";
import { Bai_Jamjuree } from "next/font/google";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

interface PopupProps {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Popup = ({ className, children, isOpen, onClose }: PopupProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div
        className={clsx(
          "bg-white overflow-hidden rounded-lg shadow-lg relative",
          baiJamjuree,
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
