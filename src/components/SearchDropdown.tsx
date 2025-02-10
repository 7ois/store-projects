'use client'
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    id: number;
    value: string;
}

interface DropdownProps {
    items: DropdownItem[];
    onSelect: (value: number) => void;
    onSearchChange?: (search: string) => void; // เพิ่ม prop นี้
    labelName?: string;
    className?: string;
}

const SearchDropdown: React.FC<DropdownProps> = ({ items, onSelect, onSearchChange, labelName, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>('select');
    const [search, setSearch] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);

    useEffect(() => {
        if (onSearchChange) {
            onSearchChange(search); // เรียกใช้งาน prop นี้เพื่อแจ้ง searchTerm ไปยัง Component ที่ใช้
        }
    }, [search, onSearchChange]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (selectedId: number) => {
        onSelect(selectedId);
        setIsOpen(false); // ปิด Dropdown หลังเลือก
        const selectedName = items.find(item => item.id === selectedId);
        setSelected(selectedName?.value);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        const filtered = items.filter(item =>
            item.value.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    return (
        <div className={clsx("relative inline-block text-left", className)}>
            <div className="grid gap-1">
                <div
                    onClick={toggleDropdown}
                    className="cursor-pointer flex w-full h-[50px] items-center justify-between rounded-lg border border-[#c5c5c5] bg-white text-base text-gray-700 focus:outline-none px-2"
                >
                    <h1 className={`${selected !== 'select' ? 'text-[#000]' : 'text-gray-400'}`}>
                        {selected}
                    </h1>
                    <ChevronDown size={15} className={`${isOpen ? '-scale-100' : 'scale-100'}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full h-auto rounded-md shadow-lg border border-[#c5c5c5] bg-[#fff] z-10">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        className="w-full h-[40px] pl-2 border-b border-[#c5c5c5] rounded-t-md text-base"
                        placeholder="Search..."
                    />
                    <div role="menu">
                        {filteredItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e1e1e1] cursor-pointer"
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


export default SearchDropdown;
