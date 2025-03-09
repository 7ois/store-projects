"use client";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import { User } from "@/entity/user";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface TypeEdit {
  isOpenAddType: boolean;
  setOpenPopup: () => void;
  editData?: { first_name: string; last_name: string; user_id: number };
}

const PopupEditUser = ({ isOpenAddType, setOpenPopup, editData }: TypeEdit) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });
  const [user, setUser] = useState<User | null>(null);

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
    checkToken();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData((prev) => ({
        ...prev,
        first_name: editData.first_name,
        last_name: editData.last_name,
      }));
    }
  }, [editData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user && user.user_id) {
      try {
        const updatedFormData = { ...formData, user_id: user.user_id };

        let response;
        if (editData) {
          response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/updateUser/${editData.user_id}`,
            updatedFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/postTypeProjects`,
            updatedFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        console.log("Response: ", response.data);
        setOpenPopup();
        setFormData({ first_name: "", last_name: "" });
      } catch (err) {
        console.log("Error: ", err);
      }
    } else {
      console.log("User is not logged in or no user_id available");
    }
  };

  return (
    <Popup isOpen={isOpenAddType} onClose={setOpenPopup} className="w-auto">
      <div className="text-lg">
        <div className="border-b-[1px] grid items-center justify-center py-5 bg-blue text-white text-2xl">
          <h1>แก้ไขชื่อผู้ใช้</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 m-5 items-center justify-center">
            <div className="flex gap-2 m-5 items-center justify-center">
              <label>ชื่อจริง</label>
              <input
                name="type_name"
                className="border h-[50px] rounded-lg pl-2"
                placeholder="กรอกชื่อจริง"
                type="text"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className="flex gap-2 m-5 items-center justify-center">
              <label>นามสกุล</label>
              <input
                name="type_name"
                className="border h-[50px] rounded-lg pl-2"
                placeholder="กรอกนามสกุล"
                type="text"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 p-5 border-t-[1px]">
            <button
              type="button"
              className="border border-primary text-primary h-[40px] w-full rounded-lg transition duration-75 hover:bg-primary hover:text-white"
              onClick={setOpenPopup}
            >
              ยกเลิก
            </button>
            <button className="bg-blue text-white h-[40px] w-full rounded-lg transition duration-75 hover:bg-orange hover:text-white">
              {editData ? "บันทึก" : "เพิ่ม"}
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupEditUser;
