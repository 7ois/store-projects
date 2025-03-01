"use client";
import { ChevronDown, DoorOpen, Pencil, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Modal from "./Modal";
import { jwtDecode } from "jwt-decode";
import { User } from "@/entity/user";
import Dropdown from "./Dropdown";
import { useAllProjectStore } from "@/stores/allProjectStore";
import { useMyProjectStore } from "@/stores/myProjectStore";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // ดึง pathname ปัจจุบัน
  const params = useParams(); // ดึงข้อมูลจาก params
  const { typeId } = params;

  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [year, setYear] = useState("");

  useEffect(() => {
    setValue("");
    setYear("");
  }, [pathname]);

  const currentYear = new Date().getFullYear();
  const yearData = [
    { id: 0, value: "ทั้งหมด" },
    ...Array.from({ length: 5 }, (_, index) => {
      const yearInBuddhistEra = currentYear - index + 543;
      return { id: index + 1, value: yearInBuddhistEra.toString() };
    }),
  ];

  const { fetchProjects } = useAllProjectStore();
  const { fetchMyProjects } = useMyProjectStore();

  useEffect(() => {
    if (
      pathname === "/add_project" ||
      pathname.startsWith("/project_center/") ||
      value.length >= 2
    ) {
      if (pathname === "/add_project") {
        fetchMyProjects({ search: value, year });
      } else {
        fetchProjects({
          typeId: typeId?.toLocaleString(),
          search: value,
          year,
        });
      }
    }
  }, [value, year, pathname, typeId, fetchProjects, fetchMyProjects]);

  const handleYearSelect = (_: number, value: string) => {
    setYear(value);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      } else {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      }
    };
    const intervalId = setInterval(checkToken, 5000);

    checkToken();
    return () => clearInterval(intervalId);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (event.target.id !== "modal" && isOpen) {
        toggleModal();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const shouldShowSearchAndYear =
    pathname === "/add_project" || /^\/project_center\/\d+$/.test(pathname);

  return (
    <div className="h-[100px] w-full px-20 flex justify-between items-center shadow-md sticky top-0 z-10 bg-white">
      <div className="w-3/4 flex items-center gap-5">
        {/* แสดง Search และปีการศึกษาตามเงื่อนไข */}
        {shouldShowSearchAndYear && (
          <>
            <div className="w-1/4 h-10 flex items-center gap-2">
              <Search size={20} />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="p-3 w-full h-full focus:outline-none"
                placeholder="Quick Search (ctrl + K)"
              />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <h1>ปีการศึกษา</h1>
              <Dropdown
                items={yearData}
                onSelect={handleYearSelect} // อัปเดตค่า year
                className="border-none"
              />
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer transition delay-75 hover:text-orange"
          onClick={toggleModal}
        >
          <p className="text-base">{user?.email ? user.email : "account"}</p>
          <ChevronDown
            size={15}
            className={`${isOpen ? "-scale-100" : "scale-100"}`}
          />
        </div>

        {/* No user */}
        {!user ? (
          <Modal
            isOpen={isOpen}
            position="right"
            classNameContainer="flex flex-col bg-[#fff] border-[1px] rounded-[10px] shadow-xl w-[300px] h-[140px] top-[40px]"
          >
            <div
              id="modal"
              className="w-full h-[90px] flex items-center justify-center"
            >
              <button
                id="modal"
                type="button"
                className="w-[260px] h-[50px] bg-blue rounded-[10px] text-[#fff] text-base transition delay-75 hover:bg-orange"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>
            <button
              id="modal"
              type="button"
              className="bg-blue text-[#fff] text-base text-left h-[50px] rounded-b-[10px] flex gap-2 items-center pl-5 transition delay-75 hover:bg-orange"
              onClick={() => router.push("/register")}
            >
              <Pencil size={15} />
              Create an account
            </button>
          </Modal>
        ) : (
          /* Login */
          <Modal
            isOpen={isOpen}
            position="right"
            classNameContainer="flex flex-col bg-[#fff] border-[1px] rounded-[10px] shadow-xl w-[300px] h-auto top-[40px]"
          >
            <div className="grid gap-1 pl-3 py-3">
              <div className="flex gap-2">
                <p className="text-base">
                  {user?.first_name ? user.first_name : ""}
                </p>
                <p className="text-base">
                  {user?.last_name ? user.last_name : ""}
                </p>
              </div>
              <p className="text-[#B4B4B4]">{user?.email ? user.email : ""}</p>
            </div>
            <button
              className="bg-blue text-[#fff] text-base text-left h-[50px] rounded-b-[10px] flex gap-2 items-center pl-5 transition delay-75 hover:bg-orange"
              onClick={handleLogout}
            >
              <DoorOpen size={20} />
              Logout
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Navbar;
