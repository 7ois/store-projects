"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/entity/user";

const menu = [
  { id: 1, title: "Dashboard", Link: "/dashboard" },
  { id: 2, title: "Add type project", Link: "/add_type_project" },
  { id: 3, title: "Add project", Link: "/add_project" },
];

const Sidebar = () => {
  const router = useRouter();

  const [activeButton, setActiveButton] = useState<number | null>(null);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dashboard");
    } else {
      // Decode token to get user information
      const decoded: any = jwtDecode(token);
      setUser(decoded); // Set username from token
    }
  }, [router]);

  const filteredMenu = !user
    ? menu.filter((item) => item.id === 1) // ถ้าไม่มี user แสดงเฉพาะ id 1
    : user.role_id && user.role_id > 2
    ? menu.filter((item) => [1, 3].includes(item.id)) // role_id > 2 แสดงเฉพาะ id 1 และ 3
    : menu; // role_id <= 2 แสดงทั้งหมด

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
        {filteredMenu.map((item) => (
          <Link key={item.title} href={item.Link} className="w-full">
            <button
              className={`${
                activeButton === item.id
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
