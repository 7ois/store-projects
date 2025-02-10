"use client";
import { ChevronDown, Pencil, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { jwtDecode } from "jwt-decode";
import { User } from "@/entity/user";

const Navbar = () => {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // useEffect(() => {
  //     axios.get("http://localhost:3001/user/checkSession", {
  //         withCredentials: true, // ให้ cookie ส่งไปกับคำขอ
  //     })
  //         .then((response) => {
  //             setUser(response.data); // ใช้ response.data
  //         })
  //         .catch(() => {
  //             setUser(null);
  //         });
  // }, []);

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

  return (
    <div className="relative h-[100px] w-full px-20 bg-[#fff] flex justify-between items-center shadow-md z-20">
      <div className="w-3/4 flex gap-5">
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
        <button
          type="button"
          className="border border-blue text-blue w-20 h-10 rounded-[10px]"
        >
          Label
        </button>
      </div>

      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleModal}
        >
          <p className="text-base">{user?.email ? user.email : "account"}</p>
          <p className="text-base">{user?.first_name ? user.first_name : ""}</p>
          <p className="text-base">{user?.last_name ? user.last_name : ""}</p>
          <ChevronDown
            size={15}
            className={`${isOpen ? "-scale-100" : "scale-100"}`}
          />
        </div>

        <Modal
          isOpen={isOpen}
          position="right"
          classNameContainer="flex flex-col bg-[#fff] rounded-[10px] shadow-xl w-[300px] h-[140px] top-[40px]"
        >
          <div
            id="modal"
            className="w-full h-[90px] flex items-center justify-center"
          >
            <button
              id="modal"
              type="button"
              className="w-[260px] h-[50px] bg-blue rounded-[10px] text-[#fff] text-base"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>
          <button
            id="modal"
            type="button"
            className="bg-blue text-[#fff] text-base text-left h-[50px] rounded-b-[10px] flex gap-2 items-center pl-5"
            onClick={() => router.push("/register")}
          >
            <Pencil size={15} />
            Create an account
          </button>
          <button onClick={handleLogout}>Logout</button>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
