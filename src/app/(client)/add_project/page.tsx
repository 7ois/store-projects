"use client";
import { Book, CircleAlert, CircleX, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Popup from "@/components/Popup";
import axios from "axios";
import PopupAddProjects from "@/components/PopupAddProjects";
import PopupEditProject from "@/components/PopupEditProject";
import { useMyProjectStore } from "@/stores/myProjectStore";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
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

  useEffect(() => {
    setCurrentPage(1);
  }, [pathname]);

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
    <div
      className="flex flex-col gap-2 h-full w-full relative
      lg:text-lg"
    >
      <div
        className="flex items-center justify-between p-5 rounded-lg shadow-md bg-gradient-to-r from-blue to-white
        lg:text-xl lg:h-[80px]
        2xl:text-2xl 2xl:h-[100px]"
      >
        <h1 className="text-white lg:text-xl 2xl:text-2xl">โครงงานของฉัน</h1>
        <button
          className="bg-white flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition duration-75 hover:border-orange hover:text-orange
          lg:text-lg"
          onClick={() => setIsOpenAddProject(true)}
        >
          <Book size={20} />
          เพิ่มโครงงาน
        </button>
      </div>
      <div className="max-h-[550px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
        <div className="grid gap-3">
          {projects.length === 0 && (
            <div className="grid items-center justify-center text-gray-500">
              <h1>ไม่มีข้อมูล</h1>
            </div>
          )}
          {projects.map((item) => (
            <div
              onClick={() => router.push(`/add_project/${item.project_id}`)}
              key={item.project_id}
              className="grid grid-cols-[auto_120px] h-auto gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full min-h-[100px] overflow-hidden transition duration-75 hover:bg-blue hover:text-white"
            >
              <div className="w-full overflow-hidden grid gap-3">
                <h1>{item.project_name_th}</h1>
                <p className="text-[#B4B4B4] text-base w-full truncate">
                  {item.abstract_th}
                </p>
                {!item.type_id && (
                  <div className="flex items-center gap-2">
                    <CircleAlert className="text-primary" size={15} />
                    <p className="text-primary text-sm">
                      ประเภทโครงงานไม่มีแล้ว
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center justify-center">
                <button
                  className="bg-primary text-white rounded-lg p-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={item.role_group !== "main_owner"}
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
        <div className="bg-white rounded-lg shadow-lg text-center grid items-center justify-center text-lg">
          <div className="w-full p-5 text-primary grid items-center justify-center">
            <CircleX strokeWidth={1} className="w-40 h-40" />
            <p className="font-medium">ยืนยันการลบ</p>
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

      <Popup
        isOpen={isOpenAddProject}
        onClose={handleClosePopup}
        className="lg:w-3/4 2xl:w-4/4"
      >
        <PopupAddProjects closePopup={handleClosePopup} />
      </Popup>

      <Popup
        isOpen={isOpenEditProject}
        onClose={handleClosePopup}
        className="lg:w-3/4"
      >
        <PopupEditProject
          selectedProjectId={selectedProjectId}
          closePopup={handleClosePopup}
        />
      </Popup>
    </div>
  );
};

export default Page;
