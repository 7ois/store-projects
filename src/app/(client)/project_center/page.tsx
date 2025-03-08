"use client";
import { useAllProjectStore } from "@/stores/allProjectStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
  project_count: number;
}

const Page = () => {
  // const router = useRouter();
  const [typeProject, setTypeProject] = useState<TypeProject[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(0);

  useEffect(() => {
    const fetchTypeProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          const totalProjectCount = data.reduce((total, type) => {
            const count = parseInt(type.project_count, 10) || 0; // แปลงเป็น number และตั้งค่าเป็น 0 ถ้าเป็น NaN
            return total + count;
          }, 0);

          // เพิ่มข้อมูลที่ตำแหน่ง 0 พร้อม project_count ที่รวม
          const newData = [
            {
              type_id: 0,
              type_name: "ทั้งหมด",
              project_count: totalProjectCount,
            },
            ...data,
          ];

          setTypeProject(newData);
        } else {
          console.log("ข้อมูลไม่ถูกต้อง");
        }
      } catch (err) {
        console.error("Error fetching type projects:", err);
      }
    };

    fetchTypeProjects();
  }, []);

  const formatProjectCount = (count: number) => {
    if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`; // Billion
    } else if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`; // Million
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`; // Thousand
    } else {
      return new Intl.NumberFormat().format(count); // For less than 1000
    }
  };

  const handleClick = (id: number) => {
    setCurrentPage(1);
    fetchProjects({
      limit: 10,
      offset: 0,
    });
    setTypeId(id.toString());
    setActiveButton(id);
  };

  //
  // const typeId = selectType;
  const {
    projects,
    currentPage,
    setTypeId,
    typeId,
    fetchProjects,
    setCurrentPage,
    totalCount,
  } = useAllProjectStore();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    sessionStorage.removeItem("redirectTo");
  }, []);

  useEffect(() => {
    if (typeId) {
      fetchProjects({
        typeId: typeId,
        limit,
        offset: (currentPage - 1) * limit,
      });
      setActiveButton(parseInt(typeId, 10));
    }
  }, [typeId, setTypeId, fetchProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects({
      typeId: typeId!,
      limit,
      offset: (page - 1) * limit,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full relative">
      <div className="flex text-2xl text-white items-center p-5 rounded-lg shadow-md h-[86px] bg-gradient-to-r from-blue to-white">
        <h1>เลือกประเภทโครงการ</h1>
      </div>

      <div className="w-full max-w-[1503.16px] h-auto overflow-hidden px-2">
        <div className="w-full h-full overflow-x-scroll scroll-smooth">
          <ul className="w-full flex gap-5 flex-nowrap pb-4 pt-2 text-lg">
            {typeProject.length > 0 ? (
              typeProject.map((type) => (
                <div
                  key={type.type_id}
                  onClick={() => handleClick(type.type_id)}
                  className="w-[300px] flex-shrink-0"
                >
                  <li
                    className={`relative flex items-center bg-blue text-white rounded-lg shadow-lg justify-center w-full h-20 cursor-pointer transition-transform duration-75 ${
                      activeButton === type.type_id
                        ? "bg-orange"
                        : "hover:bg-orange hover:-translate-y-1"
                    }`}
                  >
                    <span className="text-base font-medium">
                      {type.type_name}
                    </span>

                    <span className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                      {formatProjectCount(type.project_count)} โครงงาน
                    </span>
                  </li>
                </div>
              ))
            ) : (
              <p>ไม่พบข้อมูล</p>
            )}
          </ul>
        </div>
      </div>

      <div className="max-h-[437px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md text-lg">
        <div className="grid gap-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                href={`/project_center/${project.project_id}`}
                key={project.project_id}
                className="grid gap-3 items-center rounded-[10px] shadow-md p-5 cursor-pointer w-full h-auto overflow-hidden transition duration-75 hover:bg-blue hover:text-white"
              >
                <h1
                  className="font-medium overflow-hidden text-ellipsis break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.project_name_th}
                </h1>

                <p
                  className="text-[#B4B4B4] text-base w-full overflow-hidden text-ellipsis break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.abstract_th}
                </p>
              </Link>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="absolute bottom-0 w-full flex justify-between items-center mt-4 text-lg">
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
          disabled={currentPage === totalPages || currentPage > totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="w-[100px] h-[50px] bg-blue text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default Page;
