"use client";
import { Book, Pencil, Trash2, TriangleAlert, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePopup } from "@/context/PopupContext";
import Popup from "@/components/Popup";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import { User } from "@/entity/user";
import { Project } from "@/entity/project";
import { jwtDecode } from "jwt-decode";
import PopupAddProjects from "@/components/PopupAddProjects";
// import SearchDropdown from "@/components/SearchDropdown";

const Page = () => {
  const { openPopup, closePopup } = usePopup();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ success: boolean; data: Project[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/getMyProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProjects(response.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleClosePopup = () => {
    closePopup();
    fetchProjects(); // เรียก fetchProjects หลังจากที่ปิด Popup
  };

  const handleDelete = async (projectId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteProject/${projectId}`,
      );

      fetchProjects();
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  return (
    <div className="flex w-full gap-5">
      <div className="p-5 rounded-[10px] shadow-md w-full h-full">
        <div className="relative flex items-center w-full mb-5 justify-end">
          <div className="absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
            <h1 className="text-xl text-[#fff]">My project</h1>
          </div>
          <button
            className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px]"
            onClick={openPopup}
          >
            <Book size={20} />
            Add Project
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading &&
          projects.map((item) => (
            <div
              key={item.project_id}
              className="grid grid-cols-[auto_120px] gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden"
            >
              <div>
                <h1 className="text-xl">{item.project_name_th}</h1>
                <p className="text-[#B4B4B4] text-base w-full truncate">
                  {item.abstract_th}
                </p>
                {!item.type_id && (
                  <div className="flex">
                    <p className="text-red-500 text-sm">
                      ประเภทโครงงานไม่มีแล้วนะจ๊ะ
                    </p>
                    <TriangleAlert className="text-primary" />
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center justify-center">
                <button
                  className="bg-primary text-white rounded-lg p-4"
                  onClick={() => handleDelete(item.project_id)}
                >
                  <Trash2 />
                </button>
                <button className="bg-blue text-white rounded-lg p-4">
                  <Pencil />
                </button>
              </div>
              {/* {item.keywords && (
                <p className="text-sm text-gray-500">
                  Keywords: {item.keywords}
                </p>
              )}
             */}
            </div>
          ))}
      </div>
      <Popup>
        <PopupAddProjects closePopup={handleClosePopup} />
      </Popup>
    </div>
  );
};

export default Page;

// const confirmDelete = () => {};
