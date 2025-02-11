"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const menu = [
  { id: 1, title: "Dashboard", Link: "/dashboard" },
  { id: 2, title: "Add type project", Link: "/add_type_project" },
  { id: 3, title: "Add project", Link: "/add_project" },
];

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // ตรวจสอบว่า pathname ตรงกับ Link ใดในเมนู
    const activeMenuItem = menu.find((item) => {
      // สำหรับหน้า Dashboard หรือ Dashboard/[id]
      if (item.Link === "/dashboard" && pathname.startsWith("/dashboard")) {
        return true;
      }
      return pathname === item.Link;
    });
    if (activeMenuItem) {
      setActiveButton(activeMenuItem.id);
    }
  }, [pathname]); // เมื่อ pathname เปลี่ยนแปลง, useEffect จะทำงานใหม่

  return (
    <div className="z-10 w-[400px] h-screen bg-[#fff] drop-shadow-lg p-5">
      <div className="mb-10 h-16 flex justify-center items-center">
        <Link href="/">Logo</Link>
      </div>
      <div className="flex items-center justify-center flex-col gap-3">
        {menu.map((item) => (
          <Link key={item.title} href={item.Link} className="w-full">
            <button
              className={`${
                activeButton == item.id
                  ? "bg-blue text-[#fff] shadow-md"
                  : "bg-[#fff] text-[#000] shadow-md"
              } w-full h-20 rounded-[10px] text-xl text-left pl-5`}
              onClick={() => setActiveButton(item.id)}
            >
              {item.title}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
