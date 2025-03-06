"use client";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DropdownItem {
  id: number;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (id: number, value: string) => void;
  selectedId?: number;
  labelName?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  onSelect,
  selectedId,
  labelName,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>("กรุณาเลือก");

  useEffect(() => {
    const selectedType = items.find((item) => item.id === selectedId);
    setSelected(selectedType?.value || "กรุณาเลือก");
  }, [selectedId]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (selectedIds: number, selectedValue: string = "") => {
    onSelect(selectedIds, selectedValue);
    setIsOpen(false); // ปิด Dropdown หลังเลือก
    const selectedName = items.find((item) => item.id == selectedIds);
    setSelected(selectedName?.value);
  };

  return (
    <div
      className={clsx("relative inline-block text-left text-base", className)}
    >
      <div className="grid gap-1">
        <label>{labelName}</label>
        <div
          onClick={toggleDropdown}
          className="cursor-pointer flex min-w-[110px] h-[50px] px-2 items-center justify-between rounded-lg border border-[#c5c5c5] bg-white text-gray-700 focus:outline-none"
        >
          <h1
            className={`${
              selected !== "กรุณาเลือก" ? "text-black" : "text-gray-400"
            } w-full truncate overflow-hidden whitespace-nowrap`}
          >
            {selected}
          </h1>
          <ChevronDown
            size={15}
            className={`${isOpen ? "-scale-100" : "scale-100"}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full h-auto rounded-md shadow-lg border border-[#c5c5c5] bg-[#fff] z-10">
          <div role="menu">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item.id, item.value)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#e1e1e1] cursor-pointer"
                role="menuitem"
              >
                {item.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
