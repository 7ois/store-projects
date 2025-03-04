"use client";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import axios from "axios";
import { User } from "@/entity/user";
import { jwtDecode } from "jwt-decode";

interface TypeAdd {
  isOpenAddType: boolean;
  setOpenPopup: () => void;
  editData?: { type_name: string; type_id: number };
}

const PopupTypeProject = ({
  setOpenPopup,
  isOpenAddType,
  editData,
}: TypeAdd) => {
  const [formData, setFormData] = useState({ user_id: "", type_name: "" });
  const [user, setUser] = useState<User | null>(null);

  // If editData is provided, populate formData with the existing data
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
        type_name: editData.type_name,
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
            `${process.env.NEXT_PUBLIC_API_URL}/updateTypeProjects/${editData.type_id}`,
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
        setFormData({ user_id: "", type_name: "" });
      } catch (err) {
        console.log("Error: ", err);
      }
    } else {
      console.log("User is not logged in or no user_id available");
    }
  };

  return (
    <>
      <Popup isOpen={isOpenAddType} onClose={setOpenPopup}>
        <div className="border-b-[1px] grid items-center justify-center py-5 bg-blue text-white">
          <h1>{editData ? "แก้ไขประเภทโครงงาน" : "เพิ่มประเภทโครงงาน"}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 m-5 items-center justify-center">
            <label>ชื่อประเภทโครงงาน</label>
            <input
              name="type_name"
              className="border h-[50px] rounded-lg pl-2"
              placeholder="กรอกชื่อประเภทโครงงาน"
              type="text"
              onChange={handleChange}
              value={formData.type_name}
            />
          </div>
          <div className="flex items-center justify-between gap-2 p-5 border-t-[1px]">
            <button
              type="button"
              className="border border-primary text-primary h-[40px] w-full rounded-lg transition duration-75 hover:bg-primary hover:text-white"
              onClick={setOpenPopup}
            >
              Cancel
            </button>
            <button className="bg-blue text-white h-[40px] w-full rounded-lg transition duration-75 hover:bg-orange hover:text-white">
              {editData ? "Save Changes" : "Submit"}
            </button>
          </div>
        </form>
      </Popup>
    </>
  );
};

export default PopupTypeProject;
