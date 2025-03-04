"use client";
import { Book, Pencil, Trash2, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import Popup from "@/components/Popup";
import axios from "axios";
import PopupAddProjects from "@/components/PopupAddProjects";
import Jojo from "../../../../public/images/Jojo.jpg";
import Image from "next/image";
import PopupEditProject from "@/components/PopupEditProject";
import { useMyProjectStore } from "@/stores/myProjectStore";

const Page = () => {
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
    <div className="relative grid w-full gap-5 h-full">
      <div className="flex flex-col gap-3 max-h-[650px] w-full h-[650px] rounded-lg p-5 overflow-auto shadow-md">
        <div className="relative flex items-center w-full mb-5 justify-end">
          <div className="absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
            <h1 className="text-xl text-[#fff]">My project</h1>
          </div>
          <button
            className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition duration-75 hover:border-orange hover:text-orange"
            onClick={() => setIsOpenAddProject(true)}
          >
            <Book size={20} />
            Add Project
          </button>
        </div>

        {/* {loading && <p>Loading...</p>} */}
        {projects.map((item) => (
          <div
            key={item.project_id}
            className="grid grid-cols-[auto_120px] gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden transition duration-75 hover:bg-blue hover:text-white"
          >
            <div>
              <h1 className="text-xl">{item.project_name_th}</h1>
              <p className="text-[#B4B4B4] text-base w-full truncate">
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
                onClick={() => handleTrashDelete(item.project_id)}
              >
                <Trash2 />
              </button>
              <button
                className="bg-blue text-white rounded-lg p-4 transition duration-75 hover:bg-orange"
                onClick={() => openPopup(item.project_id)}
              >
                <Pencil />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Popup isOpen={isOpenDeleteProject} onClose={handleClosePopup}>
        <div className="p-5 bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold mb-3">
            ไม่เดินออกไปแต่กดเข้ามางั้นรึ!!!!!!!!!
          </h1>
          <Image src={Jojo} alt="Jojo" />
          <div className="flex gap-4 justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleDelete(selectedDelete!)}
            >
              เดินเข้าไปหา!
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg"
              onClick={() => setIsOpenDeleteProject(false)}
            >
              รีบเดินหนี!
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
          Page {currentPage} of {totalPages}
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
