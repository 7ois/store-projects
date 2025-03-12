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
        }
      );

      localStorage.setItem("token", response.data.token);
      setOpenPopup();
    } catch {}
  };

  return (
    <Popup
      isOpen={isOpenEditUser}
      onClose={setOpenPopup}
      className="w-5/6 lg:w-2/4"
    >
      <div className="lg:text-lg">
        <div
          className="border-b-[1px] grid items-center justify-center py-5 bg-blue text-white text-lg
          lg:text-xl
          2xl:text-2xl"
        >
          <h1>แก้ไขชื่อผู้ใช้</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div
            className="grid gap-2 m-5 items-center justify-center
          lg:flex lg:gap-2"
          >
            <div className="flex gap-2 items-center justify-center">
              <label className="text-nowrap">ชื่อจริง</label>
              <input
                name="first_name"
                className="border rounded-lg pl-2 h-[40px] w-full
                lg:h-[50px]"
                placeholder="กรอกชื่อจริง"
                type="text"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className="flex gap-2 items-center justify-center">
              <label>นามสกุล</label>
              <input
                name="last_name"
                className="border rounded-lg pl-2 h-[40px] w-full
                lg:h-[50px]"
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
              className="h-[50px] border border-primary text-primary w-full rounded-lg transition duration-75 hover:bg-primary hover:text-white"
              onClick={setOpenPopup}
            >
              ยกเลิก
            </button>
            <button className="h-[50px] bg-blue text-white w-full rounded-lg transition duration-75 hover:bg-orange hover:text-white">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupEditUser;
