"use client";
import { Book, CircleX, Pencil, Trash2, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import Popup from "@/components/Popup";
import axios from "axios";
import PopupAddProjects from "@/components/PopupAddProjects";
import Jojo from "../../../../public/images/Jojo.jpg";
import Image from "next/image";
import PopupEditProject from "@/components/PopupEditProject";
import { useMyProjectStore } from "@/stores/myProjectStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { projects, currentPage, fetchMyProjects, setCurrentPage, totalCount } =
    useMyProjectStore();
  const [isOpenAddProject, setIsOpenAddProject] = useState(false);
  const [isOpenDeleteProject, setIsOpenDeleteProject] = useState(false);
  const [isOpenEditProject, setIsOpenEditProject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);
  const [selectedDelete, setSelectedDelete] = useState<number | null>(null);
  const openPopup = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsOpenEditProject(true);
  };

  useEffect(() => {
    setIsOpenEditProject(true);
    if (!selectedProjectId) {
      setIsOpenEditProject(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchMyProjects({
      limit,
      offset: (currentPage - 1) * limit,
    });
  }, [fetchMyProjects, currentPage]);

  const handleTrashDelete = (id: number) => {
    setSelectedDelete(id);
    setIsOpenDeleteProject(true);
  };

  const handleClosePopup = () => {
    setIsOpenAddProject(false);
    setIsOpenDeleteProject(false);
    setIsOpenEditProject(false);
    fetchMyProjects({ limit, offset: (currentPage - 1) * limit }); // เรียก fetchProjects หลังจากที่ปิด Popup
  };

  const handleDelete = async (projectId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteProject/${projectId}`
      );

      fetchMyProjects({ limit, offset: (currentPage - 1) * limit });
      setIsOpenDeleteProject(false);
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMyProjects({
      limit,
      offset: (page - 1) * limit,
    });
  };

  return (
    <div className="h-full w-full text-base relative">
      <div className="flex items-center justify-between p-5 rounded-lg shadow-md">
        <h1>My project</h1>
        <button
          className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition duration-75 hover:border-orange hover:text-orange"
          onClick={() => setIsOpenAddProject(true)}
        >
          <Book size={20} />
          Add Project
        </button>
      </div>
      <div className="max-h-[564px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
        <div className="grid gap-3">
          {projects.length === 0 && (
            <div className="grid items-center justify-center">
              <h1>ไม่มีข้อมูล</h1>
            </div>
          )}
          {projects.map((item) => (
            <div
              onClick={() => router.push(`/add_project/${item.project_id}`)}
              key={item.project_id}
              className="grid grid-cols-[auto_120px] gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden transition duration-75 hover:bg-blue hover:text-white"
            >
              <div className="w-full overflow-hidden grid gap-3">
                <h1>{item.project_name_th}</h1>
                <p className="text-[#B4B4B4] text-sm w-full truncate">
                  {item.abstract_th}
                </p>
                {!item.type_id && (
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="text-primary" />
                    <p className="text-primary text-sm">
                      ประเภทโครงงานไม่มีแล้วนะจ๊ะ
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center justify-center">
                <button
                  className="bg-primary text-white rounded-lg p-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrashDelete(item.project_id);
                  }}
                >
                  <Trash2 />
                </button>
                <button
                  className="bg-blue text-white rounded-lg p-4 transition duration-75 hover:bg-orange"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(item.project_id);
                  }}
                >
                  <Pencil />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Popup isOpen={isOpenDeleteProject} onClose={handleClosePopup}>
        <div className="bg-white rounded-lg shadow-lg text-center grid items-center justify-center">
          <div className="w-full p-5 text-primary grid items-center justify-center">
            <CircleX strokeWidth={1} className="w-40 h-40" />
            <p className="text-lg font-medium">ยืนยันการลบ</p>
          </div>
          <div className="flex gap-4 items-center justify-center w-[400px] p-5">
            <button
              className="bg-gray-300 text-gray-800 px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-gray-400"
              onClick={() => setIsOpenDeleteProject(false)}
            >
              ยกเลิก
            </button>

            <button
              className="bg-primary text-white px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-[#E04B4B]"
              onClick={() => handleDelete(selectedDelete!)}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </Popup>

      <div className="absolute bottom-0 w-full flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="w-[100px] h-[50px] border border-blue box-border text-blue rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white disabled:border-none"
        >
          ย้อนกลับ
        </button>
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="w-[100px] h-[50px] bg-blue text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ถัดไป
        </button>
      </div>

      <Popup isOpen={isOpenAddProject} onClose={handleClosePopup}>
        <PopupAddProjects closePopup={handleClosePopup} />
      </Popup>

      <Popup isOpen={isOpenEditProject} onClose={handleClosePopup}>
        <PopupEditProject
          selectedProjectId={selectedProjectId}
          closePopup={handleClosePopup}
        />
      </Popup>
    </div>
  );
};

export default Page;
