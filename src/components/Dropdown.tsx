import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface DropdownItem {
    role_id: number;
    role_name: string
}

interface DropdownProps {
    items: DropdownItem[];
    onSelect: (item: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ items, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>('เลือกหน่อย');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (selectedIds: number) => {
        onSelect(selectedIds);
        setIsOpen(false); // ปิด Dropdown หลังเลือก
        const selectedName = items.find(item => item.role_id == selectedIds)
        setSelected(selectedName?.role_name)
    };

    return (
        <div className="relative inline-block text-left">
            <div className='grid gap-1'>
                <label className='text-xl'>Role</label>
                <div
                    // type='button'
                    onClick={toggleDropdown}
                    className="cursor-pointer flex w-full h-[50px] items-center justify-between rounded-lg border border-[#c5c5c5] bg-white text-base text-gray-700 focus:outline-none px-2"
                >
                    <h1 className={`${selected !== "เลือกหน่อย" ? "text-[#000]" : "text-[#808080]"}`}>{selected}</h1>
                    <ChevronDown size={15} className={`${isOpen ? "-scale-100" : "scale-100"}`} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-full h-auto rounded-md shadow-lg border border-[#c5c5c5] bg-[#fff]">
                    <div role="menu">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.role_id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e1e1e1] cursor-pointer"
                                role="menuitem"
                            >
                                {item.role_name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
