"use client";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import { User } from "@/entity/user";
import axios from "axios";

interface UserEdit {
  isOpenEditUser: boolean;
  setOpenPopup: () => void;
  editData?: User;
}

const PopupEditUser = ({
  isOpenEditUser,
  setOpenPopup,
  editData,
}: UserEdit) => {
  const [formData, setFormData] = useState({
    user_id: 0,
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData((prev) => ({
        ...prev,
        user_id: editData.user_id!,
        first_name: editData.first_name,
        last_name: editData.last_name,
      }));
    }
  }, [isOpenEditUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedFormData = { ...formData };

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/updateUser/${editData?.user_id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("token", response.data.token);
      setOpenPopup();
    } catch {}
  };

  return (
    <Popup isOpen={isOpenEditUser} onClose={setOpenPopup} className="w-auto">
      <div className="text-lg">
        <div className="border-b-[1px] grid items-center justify-center py-5 bg-blue text-white text-2xl">
          <h1>แก้ไขชื่อผู้ใช้</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 m-5 items-center justify-center">
            <div className="flex gap-2 m-5 items-center justify-center">
              <label>ชื่อจริง</label>
              <input
                name="first_name"
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
                name="last_name"
                className="border h-[50px] rounded-lg pl-2"
                placeholder="กรอกนามสกุล"
                type="text"
                onChange={handleChange}
                value={formData.last_name}
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
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupEditUser;
